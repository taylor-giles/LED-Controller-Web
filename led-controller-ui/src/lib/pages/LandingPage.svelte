<script>
    import { createEventDispatcher } from "svelte";
    import { getGuestId, getNewId } from "../../api";

    const dispatch = createEventDispatcher();

    let enteredId = "";
    let isHandlingRegisterRequest = false;
    let generatedId = "Loading...";
    let numPixels = 1;

    function onRegisterClick() {
        isHandlingRegisterRequest = true;
        getNewId(numPixels).then((newId) => (generatedId = newId));
    }

    function onGuestClick() {
        getGuestId().then((guestId) => {
            let newUrl = new URL(window.location.href);
            newUrl.searchParams.append("id", guestId);
            location.assign(newUrl);
        });
    }

    function onLoginClick() {
        let newUrl = new URL(window.location.href);
        newUrl.searchParams.append("id", enteredId);
        location.assign(newUrl);
    }

    function onNewLoginClick() {
        let newUrl = new URL(window.location.href);
        newUrl.searchParams.append("id", generatedId);
        location.assign(newUrl);
    }
</script>

<div id="main">
    <div id="title">TG LED Controller</div>
    <div id="banner">Welcome!</div>
    {#if !isHandlingRegisterRequest}
        <div class="main-content">
            <ul>
                <li>
                    To register a new device, enter the number of pixels in your display and press the "Register New Device"
                    button below.
                </li>
                <li>
                    To use an existing device, enter your device ID in the field
                    below and press "Log In".
                </li>
                <li>
                    If you're just here to have a look around, thanks for
                    dropping by! Use the "Continue as Guest" button to proceed
                    to the main site.
                </li>
            </ul>
        </div>

        <div id="options-container">
            <div id="register-container">
                Enter Number of Lights in Display:
                <div id="register-input-container">
                    <input
                        type="number"
                        id="register-input"
                        min="1"
                        max="1000"
                        bind:value={numPixels}
                    />
                    <button class="button" on:click={onRegisterClick}
                        >Register New Device</button
                    >
                </div>
            </div>
            - OR -
            <div id="login-container">
                Enter Device ID:
                <div id="login-input-container">
                    <input type="text" id="id-input" bind:value={enteredId} />
                    <button class="button" on:click={onLoginClick}
                        >Log In</button
                    >
                </div>
            </div>
            - OR -
            <div id="button-container">
                <button class="button" on:click={onGuestClick}
                    >Continue as Guest</button
                >
            </div>
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
                Use this ID when connecting your controller to the stream, and
                when logging into this app.
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
    #subtitle {
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
        width: 100%;
    }

    #login-input-container {
        display: flex;
        align-items: center;
    }

    #register-container {
        display: flex;
        flex-direction: column;
        padding: 20px;
        width: 100%;
    }

    #register-input-container {
        display: flex;
        align-items: center;
    }

    #options-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    input[type="text"] {
        background-color: #ffffff08;
        border: 1px solid #ffffffd8;
        color: #f0f0f0;
        border-radius: 3px;
        padding: 5px;
        padding-inline: 5px;
        height: 100%;
        flex: 1;
        margin-right: 10px;
    }

    input[type="number"] {
        background-color: #ffffff08;
        border: 1px solid #ffffffd8;
        color: #f0f0f0;
        border-radius: 3px;
        padding: 5px;
        padding-inline: 5px;
        height: 100%;
        flex: 1;
        margin-right: 10px;
    }

    ul {
        padding-left: 18px;
    }

    li {
        margin-bottom: 10px;
    }

    #id-display-container {
        margin-top: 30px;
        margin-bottom: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #id-display {
        color: var(--accent);
        margin-left: 5px;
    }

    #instructions {
        margin-bottom: 20px;
    }

    .button {
        font-size: 11pt;
        padding-inline: 10px;
    }
</style>
