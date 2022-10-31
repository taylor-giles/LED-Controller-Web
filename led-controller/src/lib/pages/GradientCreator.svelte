<script>
    import { hslToHex } from "../../utils";
    import ColorSelector from "../ColorSelector.svelte";
    import GradientView from "../GradientView.svelte";
    let colors = []
    let currentColorHex;

    function addSelectedColor(){
        colors = [...colors, currentColorHex];
    }
</script>

<div id="main">
    <div id="preview-container">
        Preview:
        <GradientView height="45px" bind:colors/>
    </div>

    <ColorSelector bind:currentColorHex on:click={addSelectedColor} buttonText="Add Color"/>
</div>


<style>
  #main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }

  #preview-container{
    padding-inline: 10px;
    padding-top: 8px;
    height: 50%;
  }



</style>
