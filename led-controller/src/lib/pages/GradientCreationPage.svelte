<script>
  import { hslToHex } from "../../utils";
  import ColorCard from "../ColorCard.svelte";
  import ColorSelector from "../ColorSelector.svelte";
  import GradientView from "../GradientView.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let currentColorHex;
  export let savedColors = [];
  export let name = "Untitled";
  export let colors = [];

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

  function onCancel(){
    dispatch("cancel")
  }

  function onSave() {
    dispatch("save", );
  }
</script>

<div id="main">
  <div id="header">
    <div id="name-container">
      Gradient Name: 
      <input id="name-input" type="text" bind:value={name}>
    </div>
    
    <button class="button" on:click={onCancel}> Cancel </button>
    <button class="button" on:click={onSave}> Save </button>
  </div>
  
  <div id="preview-container">
    <div id="preview-label">Preview:</div>
    <div id="preview">
      <GradientView height="45px" bind:colors />
    </div>
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

  #name-container{
    display: flex;
    flex-direction: column;
    font-size: 10pt;
    flex: 1;
  }

  #header{
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding-inline: 10px;
    padding-bottom: 15px;
    border-bottom: 1px #a0a0a0 solid;
  }

  #preview-container {
    width: 100%;
    padding: 5px;
    padding-top: 15px;
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

  .button{
    font-size: 11pt;
    padding: 8px;
    padding-inline: 10px;
    height: max-content;
    margin-left: 8px;
  }

  input[type="text"]{
    background-color: #FFFFFF08;
    border: 1px solid #FFFFFFD8;
    border-radius: 3px;
    padding: 2px;
    padding-inline: 5px;
  }
</style>
