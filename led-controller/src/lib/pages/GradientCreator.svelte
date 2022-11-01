<script>
  import { hslToHex } from "../../utils";
  import ColorCard from "../ColorCard.svelte";
  import ColorSelector from "../ColorSelector.svelte";
  import GradientView from "../GradientView.svelte";
  import DragDropTouch from 'svelte-drag-drop-touch';

  let colors = [];
  let currentColorHex;

  function addSelectedColor() {
    colors = [...colors, currentColorHex];
  }

  function deleteColorAtIndex(index){
    colors.splice(index, 1);
    colors = colors;
  }

  function moveUpColorAtIndex(index){
    if(index > 0){
      let movedColor = colors[index];
      colors[index] = colors[index-1];
      colors[index-1] = movedColor;
      colors=colors;
    }
  }

  function moveDownColorAtIndex(index){
    if(index < colors.length - 1){
      let movedColor = colors[index];
      colors[index] = colors[index+1];
      colors[index+1] = movedColor;
      colors=colors;
    }
  }
</script>

<div id="main">
  <div id="preview-container">
    Preview:
    <GradientView height="45px" bind:colors />
  </div>
  <div id="colors-container">
    {#each colors as color, index}
      <ColorCard on:delete={() => deleteColorAtIndex(index)} on:movedown={() => moveDownColorAtIndex(index)} on:moveup={() => moveUpColorAtIndex(index)} hexColor={color}/>
    {/each}
  </div>

  <ColorSelector
    bind:currentColorHex
    on:click={addSelectedColor}
    buttonText="Add Color"
  />
</div>

<style>
  #main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }

  #preview-container {
    padding: 8px;
    padding-inline: 10px;
    height: max-content;
  }

  #colors-container {
    flex: 1;
    margin-top: 10px;
    padding: 10px;
    padding-inline: 10px;
    overflow-y: auto;
    white-space: nowrap;
  }


</style>
