<script>
    import { hslToHex } from "../../utils";
    import ColorCard from "../ColorCard.svelte";
    import ColorSelector from "../ColorSelector.svelte";
    import GradientView from "../GradientView.svelte";
    import { createEventDispatcher } from "svelte";
    import {getNewId} from "../../api";

    const dispatch = createEventDispatcher();

    let enteredId = "";
    let isHandlingRegisterRequest = false;
    let generatedId = "Loading...";

    function onRegisterClick() {
        isHandlingRegisterRequest = true;
        getNewId().then((res) => console.log(res))
    }

    function onGuestClick() {
        let newUrl = new URL(window.location.href);
        newUrl.searchParams.append('id', "guest");
        location.assign(newUrl)
    }

    function onLoginClick() {
        let newUrl = new URL(window.location.href);
        newUrl.searchParams.append('id', enteredId);
        location.assign(newUrl)
    }

    function onNewLoginClick(){
        let newUrl = new URL(window.location.href);
        newUrl.searchParams.append('id', generatedId);
        location.assign(newUrl)
    }
</script>

<div id="main">
    <div id="title">TG LED Controller</div>
    <div id="banner">Welcome!</div>
    {#if !isHandlingRegisterRequest}
        <div class="main-content">
            <ul>
                <li>
                    To register a new device, press the "Register New Device"
                    button below.
                </li>
                <li>
                    To use an existing device, enter your device ID in the field
                    below and press "Log In".
                </li>
                <li>
                    If you're just newUrl to have a look around, thanks for
                    dropping by! Use the "Continue as Guest" button to proceed
                    to the main site.
                </li>
            </ul>
        </div>
        <div id="login-container">
            Enter Device ID:
            <div id="login-input-container">
                <input type="text" id="id-input" bind:value={enteredId} />
                <button class="button" on:click={onLoginClick}>Log In</button>
            </div>
        </div>
        <div id="button-container">
            <button class="button" on:click={onRegisterClick}
                >Register New Device</button
            >
            <button class="button" on:click={onGuestClick}
                >Continue as Guest</button
            >
        </div>
    {:else}
        <div class="main-content">
            <div id="subtitle">
                Thank you for choosing my LED controller! :)
            </div>
            
            <div id="id-display-container">
                Your new device ID is:
                <div id="id-display">
                    {generatedId}
                </div>
            </div>

            <div id="instructions">
                Use this ID when connecting your controller to the stream, and when logging into this app.
            </div>

            <button class="button" on:click={onNewLoginClick}>
                Proceed to Controller
            </button>
        </div>
    {/if}
</div>

<style>
    #main {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
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
    #subtitle{
        margin-top: 10px;
    }
    #banner {
        text-align: center;
        padding: 10px;
        font-size: 32pt;
    }
    .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-inline: 20px;
    }

    #button-container {
        display: flex;
        justify-content: space-around;
        padding: 20px;
    }

    #login-container {
        display: flex;
        flex-direction: column;
        padding: 20px;
    }

    #login-input-container {
        display: flex;
        align-items: center;
    }

    input[type="text"] {
        background-color: #ffffff08;
        border: 1px solid #ffffffd8;
        color: #f0f0f0;
        border-radius: 3px;
        padding: 2px;
        padding-inline: 5px;
        height: 100%;
        flex: 1;
        margin-right: 10px;
    }

    ul{
        padding-left: 18px;
    }

    #id-display-container{
        margin-top: 30px;
        margin-bottom: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #id-display{
        color: var(--accent);
        margin-left: 5px;
    }

    .button{
        font-size: 11pt;
        padding-inline: 10px;
    }
</style>
