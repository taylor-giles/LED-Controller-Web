<script>
    import IconButton, { Icon } from "@smui/icon-button";
    import Star from "svelte-material-icons/Star.svelte";
    import StarOutline from "svelte-material-icons/StarOutline.svelte";
    import { createEventDispatcher } from "svelte";
    import { hexToHsl, hslRelativeLuminance, hslToHex } from "../utils";
    import HueSlider from "./HueSlider.svelte";
    import LightnessSlider from "./LightnessSlider.svelte";

    export let hue = 0;
    export let lightness = 0.5;
    export let buttonText = "Submit";
    export let savedColors = [];
    export let shadow = "0px -10px 20px 0px black";
    export let border = "";
    export let showButton = true;
    let displayWidth = showButton ? "auto" : "100%"

    let _currentColorHex = "";
    $: _currentColorHex = hslToHex(hue, 1, lightness);
    let isCurrentColorFavorited = false;
    $: isCurrentColorFavorited = savedColors.includes(_currentColorHex);
    let contrastColor="#EEE";
    $: if(hslRelativeLuminance(hue, 1, lightness) >= 0.5){
        contrastColor = "#222";
    } else {
        contrastColor="#EEE"; 
    }

    // Expose the hex value to the parent, but readonly
    export let currentColorHex = "";
    $: currentColorHex = _currentColorHex;

    const dispatch = createEventDispatcher();

    //Forward slider change events to parent
    function onHueChange(event) {
        dispatch("hueChange", event.detail[1]);
    }
    function onLightnessChange(event) {
        dispatch("lightnessChange", event.detail[1]);
    }

    //Favorite color
    function onFavoriteClick() {
        if (isCurrentColorFavorited) {
            savedColors.splice(savedColors.indexOf(_currentColorHex), 1);
        } else {
            savedColors.push(_currentColorHex);
        }
        savedColors = savedColors;
        isCurrentColorFavorited = savedColors.includes(_currentColorHex);
    }

    /**
     * Sets the selected color
     * @param colorHex
     */
    export function setColor(colorHex) {
        let hslColor = hexToHsl(colorHex);
        hue = hslColor[0];
        lightness = hslColor[2];
    }
</script>

<div style="--shadow: {shadow}; --border: {border}" id="main">
    <div id="main-container">
        <div
            style="--hue: {hue}; --lightness: {`${lightness * 100}%`}; --contrast-color: {contrastColor}; --display-width: {displayWidth};"
            id="main-color-display"
        >
            <div id="main-text">#{_currentColorHex}</div>
            <IconButton class="icon-button" on:click={onFavoriteClick}>
                {#if isCurrentColorFavorited}
                    <Star width="23px" height="23px" color={contrastColor}/>
                {:else}
                    <StarOutline width="23px" height="23px" color={contrastColor}/>
                {/if}
            </IconButton>
        </div>
        
        {#if showButton}
            <button class="button" on:click>{buttonText}</button>
        {/if}
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
            {#each savedColors as color (color)}
                <button
                    on:click={() => {
                        setColor(color);
                    }}
                    style="background-color: #{color};"
                    class="color-button"
                />
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
        padding: 0px;
        padding-top: 20px;
        border-radius: 10px;
        box-shadow: var(--shadow);
        width: 100%;
        border: var(--border);
    }
    #main-color-display {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 6px;
        padding-inline: 10px;
        border-radius: 5px;
        background-color: hsl(var(--hue), 100%, var(--lightness));
        color: var(--contrast-color);
        width: var(--display-width);
    }
    #main-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: end;

        padding-inline: 25px;
        height: auto;
        width: 100%;
    }
    #main-text {
        font-family: monospace;
        padding-left: 5px;
        padding-right: 8px;
        font-size: 14pt;
    }
    #slider-container {
        text-align: center;
        width: 100%;
    }
    #saved-colors-bg {
        background-color: #bababa;
        padding-top: 10px;
        border-radius: 0px 0px 10px 10px;
        min-height: 97px;
        padding-inline: 20px;
        overflow-x: hidden;
        width: 100%;
    }

    #saved-colors-label {
        color: #555555;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 11pt;
        letter-spacing: 2.5px;
    }

    #saved-colors-container {
        overflow-x: scroll;
        white-space: nowrap;
        padding-top: 10px;
        padding-bottom: 18px;
        width: 100%;
        text-align: left;
    }

    .color-button {
        cursor: pointer;
        height: 35px;
        width: 35px;
        border-radius: 5px;
        border: 2px solid transparent;
        margin-right: 10px;
    }
</style>
