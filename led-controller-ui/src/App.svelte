<script>
    import { DisplayType } from "../../led-controller-server/schemas";
    import { getConfig, setColors, setDisplay, setGradients } from "./api";
    import ErrorPage from "./lib/pages/ErrorPage.svelte";
    import GradientCreationPage from "./lib/pages/GradientCreationPage.svelte";
    import HomePage from "./lib/pages/HomePage.svelte";
    import LandingPage from "./lib/pages/LandingPage.svelte";

    const params = new URLSearchParams(window.location.search);
    let deviceId = params.get("id");
    console.log(deviceId);

    const PAGES = {
        HOME: "Home",
        LANDING: "Landing Page",
        GRADIENT_CREATE: "Gradient Creation",
        ERROR: "Error Page",
    };

    let savedColors = [];
    let savedGradients = [];

    let currentPage = deviceId ? PAGES.HOME : PAGES.LANDING;
    let currentEffectType;
    let currentBrightness;
    let chosenColor;
    let chosenGradient;
    let chosenSpeed;
    let chosenDirection;

    let newGradientName = "Untitled";
    let newGradientColors = [];

    console.log(deviceId)

    //Get the current state
    if (deviceId) {
        getConfig(deviceId).then((config) => {
            if (!config) {
                currentPage = PAGES.ERROR;
                return;
            }
            savedColors = config.colors;
            savedGradients = config.gradients;
            currentEffectType = config.currentDisplay.type;
            currentBrightness = config.currentDisplay.brightness;
            chosenColor = config.currentDisplay.color;
            chosenGradient = config.currentDisplay.gradient;
            chosenSpeed = config.currentDisplay.speed;
            chosenDirection = config.currentDisplay.isForward ? "Forward" : "Reverse";
        });
    }

    $: if (deviceId) setColors(deviceId, savedColors);
    $: if (deviceId) setGradients(deviceId, savedGradients);

    function updateDisplay() {
        setDisplay(deviceId, {
            type: currentEffectType,
            brightness: currentBrightness,
            color: chosenColor,
            gradient: chosenGradient,
            speed: chosenSpeed,
            isForward: chosenDirection == "Forward",
        });
    }

    function onBrightnessChange(e) {
        currentBrightness = e.detail;
        updateDisplay();
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
            on:setDisplay={updateDisplay}
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
        <LandingPage />
    {:else if currentPage == PAGES.ERROR}
        <ErrorPage deviceId={deviceId}/>
    {/if}
</div>

<style>
    #main {
        width: 100%;
        height: 100%;
        padding: 2%;
    }
</style>
