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
    export let savedColors = [];
    export let savedGradients = [];
    export let chosenColor = "000000";
    export let chosenGradient = { name: "Not Yet Chosen", colors: ["000000"] };
    export let chosenSpeed = 100;
    export let chosenDirection = "Forward";

    let speedSet = 1;
    $: speedSet = chosenSpeed / 100;

    let brightnessSet = 1;
    $: brightnessSet = currentBrightness / 100;

    function onDeleteGradient(e) {
        dispatch("deleteGradient", e.detail);
    }

    function onBrightnessChange(e) {
        dispatch("brightnessChange", Math.round(e.detail[1] * 100));
    }

    function onSpeedChange(e) {
        chosenSpeed = Math.round(e.detail[1] * 100);
    }

    function setDisplay(e) {
        dispatch("setDisplay");
    }

    function onNewGradientClick(){
        dispatch("newGradientClick");
    }
</script>

<div id="main">
    <div id="title">TG LED Controller</div>
    <div id="main-content" class="flex-spacer">
        <!-- Brightness -->
        <div id="brightness-container">
            <div id="brightness-label">Brightness: {currentBrightness}%</div>
            <div id="brightness-slider">
                <Slider
                    on:change={onBrightnessChange}
                    value={[0, brightnessSet]}
                    single
                />
            </div>
        </div>

        <!-- Effect Buttons -->
        <div class="effect-label">Choose an Effect:</div>
        <div class="effects-buttons-container">
            {#each Object.values(MONOCHROME_EFFECTS) as effect}
                {#if currentEffectType != effect}
                    <button
                        class="effect-type-button"
                        on:click={() => {
                            currentEffectType = effect;
                        }}
                    >
                        {effect.toUpperCase()}
                    </button>
                {:else}
                    <button class="effect-type-button selected">
                        {effect.toUpperCase()}
                    </button>
                {/if}
            {/each}
        </div>
        <div class="effects-buttons-container">
            {#each Object.values(ADDRESSABLE_EFFECTS) as effect}
                {#if currentEffectType != effect}
                    <button
                        class="effect-type-button"
                        on:click={() => {
                            currentEffectType = effect;
                        }}
                    >
                        {effect.toUpperCase()}
                    </button>
                {:else}
                    <button class="effect-type-button selected">
                        {effect.toUpperCase()}
                    </button>
                {/if}
            {/each}
        </div>
        <!-- Effect Options -->
        <div id="effects-options-container">
            {#if currentEffectType == EFFECTS.COLOR}
                <!-- Color Chooser -->
                <div class="color-effect-options-container">
                    <div class="effects-options-label color">
                        Choose a Color:
                    </div>
                    <ColorSelector
                        bind:savedColors
                        buttonText="Set Display"
                        bind:currentColorHex={chosenColor}
                        on:click={setDisplay}
                        showButton={false}
                        shadow=""
                    />
                </div>
            {:else}
                {#if currentEffectType != EFFECTS.GRADIENT}
                    <!-- Speed Chooser -->
                    <div class="effects-options-label">Choose a Speed:</div>
                    <div class="speed-effect-options-container">
                        <div class="speed-selector-container">
                            <div class="speed-selector">
                                <Slider
                                    single
                                    on:change={onSpeedChange}
                                    value={[0, speedSet]}
                                />
                            </div>
                            <div class="speed-selector-label-container">
                                <div class="speed-selector-label">Slow</div>
                                <div class="speed-selector-label">Fast</div>
                            </div>
                        </div>
                    </div>
                {/if}

                {#if currentEffectType == EFFECTS.WAVE}
                    <!-- Direction Chooser -->
                    <div class="effects-options-label">Choose a Direction:</div>
                    <div class="direction-effect-options-container">
                        <div class="direction-selector">
                            <input
                                type="radio"
                                class="radio-button direction-selector"
                                bind:group={chosenDirection}
                                value="Forward"
                            /> Forward
                        </div>
                        <div class="direction-selector">
                            <input
                                type="radio"
                                class="radio-button direction-selector"
                                bind:group={chosenDirection}
                                value="Reverse"
                            /> Reverse
                        </div>
                    </div>
                {/if}

                <!-- Gradient Chooser -->
                <div class="gradient-effect-options-container">
                    <div class="effects-options-label">Choose a Gradient:</div>
                    <div class="gradient-selector-container">
                        <div class="gradient-selector">
                            <GradientSelector
                                bind:gradients={savedGradients}
                                bind:chosenGradient
                                on:delete={onDeleteGradient}
                            />
                        </div>
                        <button on:click={onNewGradientClick} class="button">Add New Gradient</button>
                    </div>
                </div>
            {/if}
        </div>
        <div />
    </div>
    <button id="footer-button" class="button" on:click={setDisplay}>
        UPDATE DISPLAY
    </button>
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
        margin-inline: 25px;
        border-bottom: 1px solid var(--accent);
        margin-bottom: 30px;
    }

    #main-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
    }

    #brightness-slider {
        width: 100%;
        height: 20px;
        --sliderSecondary: #ffffff66;
        --sliderSelected: #ffffff;
    }
    #brightness-container {
        padding-inline: 5px;
        margin-bottom: 30px;
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
        margin-top: 12px;
    }

    .effect-type-button {
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
        color: #dedede;
    }
    .effect-type-button.selected {
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
    .effects-options-label.color {
        margin-bottom: -15px;
    }

    .color-effect-options-container {
        border: 1px solid black;
        border-radius: 10px;
        padding-top: 10px;
    }

    .gradient-effect-options-container {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    .gradient-selector-container {
        padding-inline: 13px;
        padding-top: 5px;
        padding-bottom: 30px;
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .gradient-selector{
        width: 100%;
        margin-bottom: 10px;
    }

    .speed-effect-options-container {
        margin-bottom: 40px;
    }
    .speed-selector {
        --sliderSecondary: #ffffff66;
        --sliderSelected: #eeeeff;
        padding-inline: 5px;
    }
    .speed-selector-label-container {
        display: flex;
        justify-content: space-between;
        padding-inline: 12px;
    }
    .speed-selector-label {
        font-size: 9pt;
    }

    .direction-effect-options-container {
        display: flex;
        margin-left: 10px;
        margin-bottom: 40px;
    }
    .direction-selector {
        padding-right: 20px;
    }

    #footer-button {
        width: 100%;
        box-shadow: 0px -10px 25px 5px black;
        background-color: var(--accent);
        font-family: "Courier New", Courier, monospace;
        letter-spacing: 2px;
    }
</style>
