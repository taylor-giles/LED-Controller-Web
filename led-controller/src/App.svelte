<script>
    import GradientCreationPage from "./lib/pages/GradientCreationPage.svelte";
    import HomePage from "./lib/pages/HomePage.svelte";
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
        "FFFFFF",
    ];

    let savedGradients = [
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
    {:else}
        <GradientCreationPage
            bind:savedColors
            bind:colors={newGradientColors}
            bind:name={newGradientName}
            on:save={onGradientSave}
            on:cancel={onGradientCreationCancel}
        />
    {/if}
</div>

<style>
    #main {
        width: 100%;
        height: 100%;
        padding: 2%;
    }
</style>
