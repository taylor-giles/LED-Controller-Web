<script>
    import Slider from "./Slider/Slider.svelte";
    export let hue = 30;
    export let selectedLightness = 0.5;
    export let max = 1;
    export let min = 0;

    let initialVal = (selectedLightness - min)/(max-min);
</script>

<div style="--hue: {hue}; --selectedLightness: {`${selectedLightness * 100}%`}; --maxSat: {`${max*100}%`}" class="slider">
	<Slider on:change={(event) => {selectedLightness = min + ((max - min) * event.detail[1])}} value={[0, initialVal]} single />
</div>

<style>
	.slider {
		--sliderSelected: #00000000;
        --sliderSecondary: linear-gradient(
            to right,
            hsl(var(--hue), 100%, 50%),
            hsl(var(--hue), 100%, var(--maxSat))
        );
        --sliderThumb: hsl(var(--hue), 100%, var(--selectedLightness));
        --sliderHeight: 10px;
        --sliderThumbSize: 28px;
        --sliderRadius: 5px;

		margin: 16px;
	}
</style>