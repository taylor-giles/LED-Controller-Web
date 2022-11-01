<script>
    import IconButton, { Icon } from "@smui/icon-button";
    import { createEventDispatcher } from "svelte";
    import RightIcon from "svelte-material-icons/ChevronRight.svelte";
    import {
        MONOCHROME_EFFECTS,
        ADDRESSABLE_EFFECTS,
        EFFECTS,
    } from "../../types/effectTypes";
    import ColorSelector from "../ColorSelector.svelte";
    import GradientSelector from "../GradientSelector.svelte";
    import Slider from "../Slider/Slider.svelte";

    const dispatch = createEventDispatcher();

    export let currentEffectType = EFFECTS.CYCLE;
    export let currentBrightness = 100;
    export let savedColors;
    export let savedGradients;
    export let chosenColor;
    export let chosenColors;
    export let chosenGradient;
    export let chosenGradients;

    function onDeleteGradient(e) {
        dispatch("deleteGradient", e);
    }

    function onBrightnessChange(e) {
        dispatch("brightnessChange", Math.round(e.detail[1] * 100));
    }

    function setDisplay(e) {
        dispatch("submit");
    }
</script>

<div id="main">
    <div id="title">TG LED Controller</div>
    <div id="main-content" class="flex-spacer">
        <!-- Brightness -->
        <div id="brightness-container">
            <div id="brightness-label">Brightness: {currentBrightness}%</div>
            <div id="brightness-slider">
                <Slider on:change={onBrightnessChange} single />
            </div>
        </div>

        <!-- Effect Buttons -->
        <div class="effect-label">Choose an Effect:</div>
        <div class="effects-buttons-container">
            {#each Object.values(MONOCHROME_EFFECTS) as effect}
                {#if currentEffectType != effect}
                    <button
                        class="option-card"
                        on:click={() => {
                            currentEffectType = effect;
                        }}
                    >
                        {effect.toUpperCase()}
                    </button>
                {:else}
                    <button class="option-card selected">
                        {effect.toUpperCase()}
                    </button>
                {/if}
            {/each}
        </div>
        <div class="effects-buttons-container">
            {#each Object.values(ADDRESSABLE_EFFECTS) as effect}
                {#if currentEffectType != effect}
                    <button
                        class="option-card"
                        on:click={() => {
                            currentEffectType = effect;
                        }}
                    >
                        {effect.toUpperCase()}
                    </button>
                {:else}
                    <button class="option-card selected">
                        {effect.toUpperCase()}
                    </button>
                {/if}
            {/each}
        </div>
        <!-- Effect Options -->
        <div id="effects-options-container">
            <!-- Color Chooser -->
            {#if currentEffectType == EFFECTS.COLOR}
                <div class="color-effect-options-container">
                    <div class="effects-options-label">Choose a Color:</div>
                    <ColorSelector
                        bind:savedColors
                        buttonText="Set Display"
                        bind:currentColorHex={chosenColor}
                        on:click={setDisplay}
                        shadow=""
                    />
                </div>
            
            <!-- Gradient Chooser -->
            {:else}
                <!-- Speed Chooser -->
                {#if currentEffectType != EFFECTS.GRADIENT}
                <div class="effects-options-label">Choose a Speed:</div>
                    <div class="speed-effect-options-container">
                        <div class="speed-selector-container">
                            <div class="speed-selector">
                                <Slider single></Slider>
                            </div>
                            <div class="speed-selector-label-container">
                                <div class="speed-selector-label">
                                    Slow
                                </div>
                                <div class="speed-selector-label">
                                    Fast
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
                <div class="gradient-effect-options-container">
                    <div class="effects-options-label">Choose a Gradient:</div>
                    <div class="gradient-selector">
                        <GradientSelector bind:gradients={savedGradients} />
                    </div>
                </div>
            {/if}
        </div>
        <div/>
    </div>
</div>

<style>
    #main {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 2%;
    }

    #title {
        font-family: "Courier New", Courier, monospace;
        font-size: 20pt;
        text-align: center;
        padding: 10px;
        margin-inline: 30px;
        border-bottom: 1px solid var(--accent);
        margin-bottom: 30px;
    }

    #main-content{
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    #brightness-slider {
        width: 100%;
        height: 20px;
        --sliderSecondary: #ffffff66;
        --sliderSelected: #ffffff;
    }
    #brightness-container {
        padding-inline: 5px;
        margin-bottom: 20px;
    }
    #brightness-label {
        padding-inline: 8px;
    }

    .effect-label {
        padding-inline: 13px;
        margin-bottom: -8px;
    }
    .effects-buttons-container {
        display: flex;
        justify-content: space-around;
        overflow-x: auto;
        white-space: nowrap;
        margin-top: 12px;
    }

    .option-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: max-content;
        height: max-content;
        line-height: middle;
        padding: 12px;
        padding-inline: 10px;
        border: 0px;
        font-family: "Courier New", Courier, monospace;
        cursor: pointer;
        border: 1px solid #a0a0a0;
        border-radius: 20px;
        background-color: transparent;
        letter-spacing: 1.5px;
    }
    .option-card.selected {
        background-color: #d0d0d0;
        color: black;
    }

    #effects-options-container {
        margin-top: 40px;
        flex: 1;
    }
    .effects-options-label {
        padding-inline: 13px;
    }

    .color-effect-options-container {
        border: 1px solid black;
        border-radius: 10px;
        padding-top: 10px;
    }

    .gradient-effect-options-container {
        display: flex;
        flex-direction: column;
        flex: 1
    }

    .gradient-selector {
        padding-inline: 10px;
        flex: 1;
    }

    .speed-effect-options-container{
        margin-bottom: 20px;
    }

    .speed-selector{
      --sliderSecondary: #FFFFFF66;
      --sliderSelected: #EEEEFF;
      padding-inline: 5px;
    }

    .speed-selector-label-container{
        display: flex;
        justify-content: space-between;
        padding-inline: 12px;
    }

    .speed-selector-label{
        font-size: 9pt;
    }

</style>
