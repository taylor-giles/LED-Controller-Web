<script>
    import ColorSelector from "../ColorSelector.svelte";

</script>

<div id="main">
    Hi there
    <div id="selector-container">
        <ColorSelector/>
    </div>
</div>


<style>
  #main {
    width: 100%;
    height: 100%;
  }

  #selector-container{
    position: absolute;
    width: 100%;
    height: max-content;
    bottom: 0;
    padding-bottom: 10px;
  }

</style>
