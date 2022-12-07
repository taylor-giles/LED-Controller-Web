<script>
    import Slider from "./Slider/Slider.svelte";
	export let selectedHue = 0;

    let setVal = 0;
    $: setVal = (selectedHue / 360) % 1; //Mod 1 to avoid negative values
</script>

<div style="--selectedHue: {selectedHue};" class="slider">
	<Slider on:change={(event) => {selectedHue = event.detail[1] * 360}} value={[0, setVal]} single />
</div>

<style>
	.slider {
		--sliderSelected: #00000000;
        --sliderSecondary: linear-gradient(
            to right,
            #FF0000,
            #FFFF00,
            #00FF00,
            #00FFFF,
            #0000FF,
            #FF00FF,
            #FF0000
        );
        --sliderThumb: hsl(var(--selectedHue), 100%, 50%);
        --sliderHeight: 10px;
        --sliderThumbSize: 28px;
        --sliderRadius: 5px;

		margin: 16px;
	}
</style>