<script>
    export let colors = [];
    export let width = "100%";
    export let height = "100%";
    export let border = "1px solid white";
    let cssBackgroundStr = "";
    $: {
        if (colors.length > 1) {
            cssBackgroundStr = "linear-gradient(to right";
            for (let color of colors) {
                cssBackgroundStr += `,#${color}`;
            }
            cssBackgroundStr += ")";
        } else if(colors.length == 1){
            cssBackgroundStr = "#"+colors[0];
        } else {
            cssBackgroundStr = "transparent";
        }
    }
</script>

<div id="background">
    <div
    style="--bg: {cssBackgroundStr};
            --width: {width};
            --height: {height};
            --border: {border}"
    id="main"
/>
</div>


<style>
    #background{
        background-image: url("/src/assets/checker-tile.png");
        border-radius: 10px;
    }
    #main {
        border-radius: 10px;
        background: var(--bg);
        height: var(--height);
        width: var(--width);
        border: var(--border);
    }
</style>
