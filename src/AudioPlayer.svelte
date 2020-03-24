<script>
    import { createEventDispatcher } from 'svelte';
    import { PauseIcon, PlayIcon, RepeatIcon, XIcon } from 'svelte-feather-icons';
    import { formatTime } from './format';
    import audio from './stores/audio';
    import loop from './stores/loop';

    $: current = $audio && $audio.currentTime;
    $: duration = $audio && $audio.duration;
    $: paused = $audio && $audio.paused;
    $: displayCurrent = formatTime(current);
    $: displayDuration = formatTime(duration);

    const dispatcher = createEventDispatcher();

    function rangeChange(event) {
        const newValue = event.target.value;
        $audio.currentTime = newValue;
    }
</script>

<div class="player row">
    <span class="col-sm-4 col-lg-1">{displayCurrent} / {displayDuration}</span>

    <span class="col-sm-5 col-lg-2">
        {#if paused}
            <button on:click={() => audio.play()}><PlayIcon size="18" /></button>
        {:else}
            <button on:click={() => audio.pause()}><PauseIcon size="18" /></button>
        {/if}
        <button on:click={() => loop.toggle()} class:active={$loop}><RepeatIcon size="18" /></button>
    </span>

    <input class="col-sm-first col-lg-normal col-lg-8 col-sm-12" type="range" min={0} max={duration} value={current} on:input={rangeChange}>

    <button class="col-lg-1 col-sm-2 col-md-offset-5 col-lg-offset-0" on:click={() => dispatcher('reset')}><XIcon size="18" /></button>
</div>

<style>
    .player {
        padding-top: 1rem;
        align-items: center;
    }
    span {
        min-width: 135px;
        max-width: 150px;
    }
    button, button:focus {
        background: none;
    }
    button {
        line-height: 0;
        margin: 1rem 0;
    }
    .active {
        color: #1976d2;
    }
    input {
        -webkit-appearance: none;
        height: 15px;
        border-radius: 5px;
        background: #d3d3d3;
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }

    input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #1976d2;
        cursor: pointer;
    }

    input::-moz-range-thumb {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #1976d2;
        cursor: pointer;
    }
</style>