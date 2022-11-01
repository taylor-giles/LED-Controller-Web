<script>
    import GradientView from "./GradientView.svelte";
    import { createEventDispatcher } from "svelte";
    import IconButton, { Icon } from "@smui/icon-button";
    import DeleteIcon from "svelte-material-icons/Delete.svelte";

    const dispatch = createEventDispatcher();

    export let gradients = [];

    function deleteGradient(gradient) {
        dispatch("delete", gradient);
    }

    function selectGradient(gradient){
        dispatch("select", gradient)
    }
</script>

<div id="main">
    {#each gradients as gradient}
        <div class="element">
            {gradient.name}
            <div class="element-content">
                <div class="gradient-view">
                    <GradientView bind:colors={gradient.colors} height="40px"/>
                </div>
                
                <button class="button" on:click={()=>selectGradient(gradient)}>Select</button>
                <IconButton on:click={()=> deleteGradient(gradient)} class="icon-button">
                    <DeleteIcon width="30px" height="30px"/>
                </IconButton>
            </div>
        </div>
        
       
    {/each}
</div>

<style>
    #main {
        width: 100%;
    }

    .element{
        border-top: 1px solid #a0a0a0;
        border-bottom: 1px solid #a0a0a0;
        margin-bottom: -1px;
        padding-top: 12px;
        padding-bottom: 12px;
    }

    .element-content{
        display: flex;
        padding-bottom: 10px;
    }

    .gradient-view{
        flex: 1;
        margin-right: 10px;
    }

    .button{
        margin-right: 10px;
    }
</style>
