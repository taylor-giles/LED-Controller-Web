<script>
    import IconButton, { Icon } from "@smui/icon-button";
    import RightIcon from "svelte-material-icons/ChevronRight.svelte";
    import ColorSelector from "./lib/ColorSelector.svelte";
    import GradientSelector from "./lib/GradientSelector.svelte";
    import GradientCreator from "./lib/pages/GradientCreationPage.svelte";
    import HomePage from "./lib/pages/HomePage.svelte";
    import Slider from "./lib/Slider/Slider.svelte";
    import { EFFECTS } from "./types/effectTypes";

    const PAGES = {
        HOME: "Home",
        GRADIENT_CREATE: "Gradient Creation",
    };

    let savedColors = [
        "FF0000",
        "FFFF00",
        "00FF00",
        "00FFFF",
        "0000FF",
        "FF00FF",
    ];

    let savedGradients = [
        {
            name: "Rainbow1",
            colors: [
                "FF0000",
                "FFFF00",
                "00FF00",
                "00FFFF",
                "0000FF",
                "FF00FF",
            ],
        },
        {
            name: "Rainbow",
            colors: [
                "FF0000",
                "FFFF00",
                "00FF00",
                "00FFFF",
                "0000FF",
                "FF00FF",
            ],
        },
        {
            name: "Rainbow1",
            colors: [
                "FF0000",
                "FFFF00",
                "00FF00",
                "00FFFF",
                "0000FF",
                "FF00FF",
            ],
        },
        {
            name: "Rainbow",
            colors: [
                "FF0000",
                "FFFF00",
                "00FF00",
                "00FFFF",
                "0000FF",
                "FF00FF",
            ],
        },
        {
            name: "Rainbow1",
            colors: [
                "FF0000",
                "FFFF00",
                "00FF00",
                "00FFFF",
                "0000FF",
                "FF00FF",
            ],
        },
        {
            name: "Rainbow",
            colors: [
                "FF0000",
                "FFFF00",
                "00FF00",
                "00FFFF",
                "0000FF",
                "FF00FF",
            ],
        },
        {
            name: "Rainbow1",
            colors: [
                "FF0000",
                "FFFF00",
                "00FF00",
                "00FFFF",
                "0000FF",
                "FF00FF",
            ],
        },
        {
            name: "Rainbow",
            colors: [
                "FF0000",
                "FFFF00",
                "00FF00",
                "00FFFF",
                "0000FF",
                "FF00FF",
            ],
        },
        {
            name: "Rainbow1",
            colors: [
                "FF0000",
                "FFFF00",
                "00FF00",
                "00FFFF",
                "0000FF",
                "FF00FF",
            ],
        },
        {
            name: "Rainbow",
            colors: [
                "FF0000",
                "FFFF00",
                "00FF00",
                "00FFFF",
                "0000FF",
                "FF00FF",
            ],
        },
    ];

    let currentPage = PAGES.HOME;
    let currentEffectType = EFFECTS.COLOR;
    let currentBrightness = 100;

    let chosenColor;
    let chosenGradient;
    let chosenColors;
    let chosenGradients;

    
    function setDisplay(){
        console.log(currentEffectType)
    }

    function onBrightnessChange(e) {
        currentBrightness = e.detail;
    }

    function onDeleteGradient(e){
        let gradient = e.detail;
        savedGradients.splice(savedGradients.indexOf(gradient), 1);
        savedGradients = savedGradients;
    }

    function onGradientSave() {}
</script>

<div id="main">
    {#if currentPage == PAGES.HOME}
        <HomePage
            bind:savedColors
            bind:savedGradients
            bind:currentEffectType
            bind:currentBrightness
            bind:chosenColors
            bind:chosenGradients
            bind:chosenColor
            bind:chosenGradient
            on:deleteGradient={onDeleteGradient}
            on:brightnessChange={onBrightnessChange}
            on:submit={setDisplay}
        />
    {:else}
        <GradientSelector bind:gradients={savedGradients} on:delete={onDeleteGradient}/>
    {/if}
</div>

<style>
    #main {
        width: 100%;
        height: 100%;
        padding: 2%;
    }
</style>
