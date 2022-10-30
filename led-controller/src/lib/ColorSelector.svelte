<script>
    import IconButton, { Icon } from "@smui/icon-button";
    import Star from "svelte-material-icons/Star.svelte";
    import StarOutline from "svelte-material-icons/StarOutline.svelte";
    import HorizontalScroller from "svelte-horizontal-scroller";
    import { createEventDispatcher } from "svelte";
    import { hexToHsl, hslToHex } from "../utils";
    import HueSlider from "./HueSlider.svelte";
    import LightnessSlider from "./LightnessSlider.svelte";

    export let hue = 0;
    export let lightness = 0.5;
    export let buttonText = "Submit";
    export let favoriteColors = [];

    let currentColorHex = hslToHex(hue, 1, lightness);
    $: currentColorHex = hslToHex(hue, 1, lightness);
    let isCurrentColorFavorited = favoriteColors.includes(currentColorHex);
    $: isCurrentColorFavorited = favoriteColors.includes(currentColorHex);

    const dispatch = createEventDispatcher();

    //Forward slider change events
    function onHueChange(event) {
        dispatch("hueChange", event.detail[1]);
    }
    function onLightnessChange(event) {
        dispatch("lightnessChange", event.detail[1]);
    }

    //Favorite color
    function onFavoriteClick() {
        console.log(...favoriteColors);
        if (isCurrentColorFavorited) {
            favoriteColors.splice(favoriteColors.indexOf(currentColorHex), 1);
        } else {
            favoriteColors.push(currentColorHex);
        }
        favoriteColors = favoriteColors;
        isCurrentColorFavorited = favoriteColors.includes(currentColorHex);
    }

    /**
     * Sets the selected color
     * @param colorHex
     */
    export function setColor(colorHex){
        let hslColor = hexToHsl(colorHex);
        hue = hslColor[0];
        lightness = hslColor[2];
    }
</script>

<div id="main">
    <div id="main-container">
        <div
            style="--hue: {hue}; --lightness: {`${lightness * 100}%`};"
            id="main-color-display"
            class="square-w"
        />
        <div id="main-options-container">
            <div id="main-text-container">
                <div id="main-text">#{hslToHex(hue, 1, lightness)}</div>
                <IconButton class="icon-button" on:click={onFavoriteClick}>
                    {#if isCurrentColorFavorited}
                        <Star width="25px" height="25px" />
                    {:else}
                        <StarOutline width="25px" height="25px" />
                    {/if}
                </IconButton>
            </div>

            <button class="button" on:click>{buttonText}</button>
        </div>
    </div>
    <div id="slider-container">
        <HueSlider on:change={onHueChange} bind:selectedHue={hue} />
        <LightnessSlider
            on:change={onLightnessChange}
            bind:selectedLightness={lightness}
            bind:hue
            min={0.5}
        />
    </div>
    <div id="saved-colors-bg">
        <div id="saved-colors-label">SAVED COLORS</div>
        <div id="saved-colors-container">
            {#each favoriteColors as color (color)}
                <button on:click={() => {setColor(color)}} style="background-color: #{color};" class="color-button"/>
            {/each}
        </div>
    </div>
</div>

<style>
    #main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: -3px -3px 10px #000000aa;
        padding: 0px;
        padding-top: 20px;
        border-radius: 10px;
        max-width: 96vw;
    }
    #main-color-display {
        padding: 0px;
        max-width: 180px;
        margin-left: 8%;
        width: 35%;
        border-radius: 15px;
        background-color: hsl(var(--hue), 100%, var(--lightness));
    }
    #main-container {
        padding: 0px;
        display: flex;
        flex-direction: row;
        height: auto;
        width: 100%;
    }
    #main-options-container {
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
    }
    #main-text-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 20px;
    }
    #main-text {
        font-family: monospace;
        padding-left: 5px;
        padding-right: 8px;
        font-size: 20pt;
    }
    #slider-container {
        text-align: center;
        width: 95%;
    }
    #saved-colors-bg {
        background-color: #BABABA;
        width: calc(100% - 40px);
        padding-top: 10px;
        border-radius: 0px 0px 15px 15px;
        min-height: 100px;
        padding-inline: 20px;
        overflow-x: hidden;
    }

    #saved-colors-label {
        color: #555555;
        width: max-content;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        letter-spacing: 2.5px;
    }

    #saved-colors-container {
        overflow-x: scroll;
        white-space:nowrap;
        padding-top: 10px;
        width: 100%;
        text-align: left;
    }

    .color-button{
        height: 50px;
        width: 50px;
        border-radius: 5px;
        border: 2px solid transparent;
        margin-right: 10px;
    }
</style>
