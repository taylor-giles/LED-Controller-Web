<script>
  import { hslToHex } from "../../utils";
  import ColorCard from "../ColorCard.svelte";
  import ColorSelector from "../ColorSelector.svelte";
  import GradientView from "../GradientView.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let colors = [];
  let currentColorHex;
  export let savedColors = [];

  function addSelectedColor() {
    colors = [...colors, currentColorHex];
  }

  function deleteColorAtIndex(index) {
    colors.splice(index, 1);
    colors = colors;
  }

  function moveUpColorAtIndex(index) {
    if (index > 0) {
      let movedColor = colors[index];
      colors[index] = colors[index - 1];
      colors[index - 1] = movedColor;
      colors = colors;
    }
  }

  function moveDownColorAtIndex(index) {
    if (index < colors.length - 1) {
      let movedColor = colors[index];
      colors[index] = colors[index + 1];
      colors[index + 1] = movedColor;
      colors = colors;
    }
  }

  function onSave(e) {
    dispatch("save", e);
  }
</script>

<div id="main">
  <div id="preview-label">Preview:</div>
  <div id="header-container">
    <div id="preview">
      <GradientView height="45px" bind:colors />
    </div>
    <button class="button" on:click={onSave}> Save </button>
  </div>
  <div id="colors-container">
    {#each colors as color, index}
      <ColorCard
        on:delete={() => deleteColorAtIndex(index)}
        on:movedown={() => moveDownColorAtIndex(index)}
        on:moveup={() => moveUpColorAtIndex(index)}
        hexColor={color}
      />
    {/each}
  </div>

  <ColorSelector
    bind:currentColorHex
    on:click={addSelectedColor}
    buttonText="Add Color"
    bind:savedColors
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

  #header-container {
    display: flex;
    width: 100%;
    padding: 5px;
    height: max-content;
  }

  #preview-label {
    margin-left: 5px;
    margin-top: 2px;
    margin-bottom: -2px;
  }

  #preview {
    flex: 1;
    padding-right: 5px;
  }

  #colors-container {
    flex: 1;
    margin-top: 10px;
    padding: 5px;
    overflow-y: auto;
    white-space: nowrap;
  }
</style>
