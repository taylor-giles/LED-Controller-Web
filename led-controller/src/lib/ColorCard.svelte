<script>
  import IconButton, { Icon } from "@smui/icon-button";
  import DeleteIcon from "svelte-material-icons/Delete.svelte";
  import UpArrowIcon from "svelte-material-icons/ArrowUpBold.svelte";
  import DownArrowIcon from "svelte-material-icons/ArrowDownBold.svelte";
  import { hexRelativeLuminance } from "../utils";
    import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let hexColor = "000000";

  let contrastColor = "#EEE";
  $: if (hexRelativeLuminance(hexColor) >= 0.5) {
    console.log(hexRelativeLuminance(hexColor))
    contrastColor = "#222";
  } else {
    console.log(hexRelativeLuminance(hexColor))
    contrastColor = "#EEE";
  }

  function onDeleteClick(e){
    dispatch('delete', e)
  }

  function onUpClick(e){
    dispatch('moveup', e)
  }

  function onDownClick(e){
    dispatch('movedown', e)
  }
</script>

<div
  style="--hex-color: #{hexColor}; --contrast-color: {contrastColor};"
  id="main"
>
  #{hexColor}

  <div id="button-container">
    <div id="arrow-button-container">
      <IconButton on:click={onUpClick} class="icon-button">
        <UpArrowIcon width="23px" height="23px" color={contrastColor}/>
      </IconButton>
      <IconButton on:click={onDownClick} class="icon-button">
        <DownArrowIcon width="23px" height="23px" color={contrastColor}/>
      </IconButton>
    </div>
    <IconButton on:click={onDeleteClick} class="icon-button">
      <DeleteIcon width="23px" height="23px" color={contrastColor}/>
    </IconButton>
  </div>
</div>


<style>
  #main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: max-content;
    margin-bottom: 10px;
    padding: 5px;
    padding-inline: 10px;
    background-color: var(--hex-color);
    color: var(--contrast-color);
    font-family: monospace;
    border-radius: 5px;
  }

  #button-container{
    display: flex;
  }

  #arrow-button-container{
    padding-inline: 10px;
  }
</style>
