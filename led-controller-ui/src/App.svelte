<script>
    import GradientCreationPage from "./lib/pages/GradientCreationPage.svelte";
    import HomePage from "./lib/pages/HomePage.svelte";
    import LandingPage from "./lib/pages/LandingPage.svelte";
    import { EFFECTS } from "./types/effectTypes";

    const params = new URLSearchParams(window.location.search);

    const PAGES = {
        HOME: "Home",
        LANDING: "Landing Page",
        GRADIENT_CREATE: "Gradient Creation",
    };

    let savedColors = [];
    let savedGradients = [];

    let currentPage = PAGES.HOME;
    if(!(params.get('id'))){
        currentPage = PAGES.LANDING;
    }
    let currentEffectType = EFFECTS.COLOR;
    let currentBrightness;
    let chosenColor;
    let chosenGradient;
    let chosenSpeed;
    let chosenDirection;

    let newGradientName = "Untitled";
    let newGradientColors = [];

    function setDisplay() {
        console.log(
            currentEffectType,
            currentBrightness,
            chosenColor,
            chosenGradient,
            chosenSpeed,
            chosenDirection
        );
    }

    function onBrightnessChange(e) {
        currentBrightness = e.detail;
    }

    function onDeleteGradient(e) {
        let gradient = e.detail;
        savedGradients.splice(savedGradients.indexOf(gradient), 1);
        savedGradients = savedGradients;
    }

    function onNewGradientClick(e) {
        currentPage = PAGES.GRADIENT_CREATE;
        newGradientName = "Untitled";
        newGradientColors = [];
    }

    function onGradientSave() {
        savedGradients = [
            ...savedGradients,
            { name: newGradientName, colors: newGradientColors },
        ];
        currentPage = PAGES.HOME;
    }

    function onGradientCreationCancel() {
        currentPage = PAGES.HOME;
    }
</script>

<div id="main">
    {#if currentPage == PAGES.HOME}
        <HomePage
            bind:savedColors
            bind:savedGradients
            bind:currentEffectType
            bind:currentBrightness
            bind:chosenColor
            bind:chosenGradient
            bind:chosenSpeed
            bind:chosenDirection
            on:deleteGradient={onDeleteGradient}
            on:brightnessChange={onBrightnessChange}
            on:newGradientClick={onNewGradientClick}
            on:setDisplay={setDisplay}
        />
    {:else if currentPage == PAGES.GRADIENT_CREATE}
        <GradientCreationPage
            bind:savedColors
            bind:colors={newGradientColors}
            bind:name={newGradientName}
            on:save={onGradientSave}
            on:cancel={onGradientCreationCancel}
        />
    {:else if currentPage == PAGES.LANDING}
        <LandingPage/>
    {/if}
</div>

<style>
    #main {
        width: 100%;
        height: 100%;
        padding: 2%;
    }
</style>
