<script>
    export let deviceId;
    $: console.log("errorpage: ", deviceId)
</script>

<div id="main">
    <div class="message">
        Unable to access device with ID: 
    </div>
    
    <div id="id-display">
        {deviceId}
    </div>

    <div class="message">
        Please double-check your ID and try again later.
    </div>
</div>

<style>
    #main {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    #id-display{
        color:var(--accent)
    }
</style>
