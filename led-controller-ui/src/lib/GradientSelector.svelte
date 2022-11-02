<script>
    import GradientView from "./GradientView.svelte";
    import { createEventDispatcher } from "svelte";
    import IconButton, { Icon } from "@smui/icon-button";
    import DeleteIcon from "svelte-material-icons/Delete.svelte";
    import CheckIcon from "svelte-material-icons/Check.svelte";

    const dispatch = createEventDispatcher();

    export let gradients = [];
    export let chosenGradient = {};

    function deleteGradient(gradient) {
        dispatch("delete", gradient);
    }

    function selectGradient(gradient) {
        chosenGradient = gradient;
    }
</script>

<div id="main">
    {#each gradients as gradient}
        {#if gradient !== chosenGradient}
            <div class="element">
                {gradient.name}
                <div class="element-content">
                    <div class="gradient-view">
                        <GradientView
                            bind:colors={gradient.colors}
                            height="40px"
                        />
                    </div>

                    <button
                        class="button"
                        on:click={() => selectGradient(gradient)}>Select</button
                    >
                    <IconButton
                        on:click={() => deleteGradient(gradient)}
                        class="icon-button"
                    >
                        <DeleteIcon
                            width="30px"
                            height="30px"
                            color="#f0f0f0"
                        />
                    </IconButton>
                </div>
            </div>
        {:else}
            <div class="element selected">
                <div class="selected-header">
                    {gradient.name}
                    <div class="selected-indicator">
                        Selected
                        <CheckIcon height="14px"/>
                    </div>
                </div>
                

                <div class="element-content">
                    <div class="gradient-view">
                        <GradientView
                            bind:colors={gradient.colors}
                            height="40px"
                        />
                    </div>
                </div>
            </div>
        {/if}
    {/each}
</div>

<style>
    #main {
        width: 100%;
    }

    .element {
        border-top: 1px solid #a0a0a0;
        padding-top: 12px;
        padding-bottom: 12px;
    }
    .element.selected {
        background-color: #f0f0f0;
        color: #222;
        padding-inline: 15px;
        padding-bottom: 10px;
        border-radius: 8px;
    }

    .element-content {
        display: flex;
        padding-bottom: 10px;
        align-items: center;
    }

    .selected-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .gradient-view {
        flex: 1;
    }

    .button {
        margin-inline: 10px;
    }
</style>
