<script>
    import { get } from 'svelte/store';
    import { loadMarkers, saveMarkers } from './storage';
    import markers from './stores/markers';
    import audio from './stores/audio';
    import AudioPlayer from './AudioPlayer.svelte';
    import FilePicker from './FilePicker.svelte';
    import Markers from './Markers.svelte';

    let file = null;
    let saveUnsubscriber;

    const { enabledMarkers, loopRange } = markers;

    function onFileSelected(event) {
        if (saveUnsubscriber) {
            saveUnsubscriber();
        }

        file = event.detail;
        audio.set(new Audio(URL.createObjectURL(file)));
        loadMarkers(file.name)
            .forEach(({ time, text }) => markers.add(time, text));

        saveUnsubscriber = markers.subscribe(saveMarkers(file.name));
    }

    function reset() {
        audio.reset();
        saveUnsubscriber();
        saveUnsubscriber = null;
        markers.set([]);
    }

    function addMarker() {
        markers.add($audio.currentTime);
    }

    document.addEventListener('keyup', event => {
        if (event.key !== 'Enter' || !$audio) return;
        addMarker();
    })
</script>

<main class="container">
    {#if $audio}
        <AudioPlayer on:reset={reset} />
        <Markers on:play={event => audio.playFromMarker(event.detail)} on:addMarker={addMarker}></Markers>
    {:else}
        <FilePicker on:file={onFileSelected} />
    {/if}
</main>