<script>
    import { createEventDispatcher } from 'svelte';
    import { EditIcon , Trash2Icon } from 'svelte-feather-icons';
    import { get } from 'svelte/store';
    import { formatTime } from './format';
    import markers from './stores/markers';
    import audio from './stores/audio';

    let editMode = false;

    const dispatcher = createEventDispatcher();
</script>

{#if $markers.length}
    <h2>
        Marqueurs :
        <button class="no-background" on:click={() => { editMode = !editMode; }}>
            <EditIcon size="18" />
        </button>
    </h2>

    {#each $markers as marker (marker.id)}
    <div class="row" class:editMode class:active={markers.isCurrentMarker($audio, marker)}>
        {#if !editMode}
            <input type="checkbox" bind:checked={marker.enabled}>
        {/if}

        {#if editMode}
            <span class="marker-time">{formatTime(marker.time, true)}</span>
        {:else}
            <span class="marker-time clickable" on:click={() => dispatcher('play', marker)}>
                {formatTime(marker.time)}
            </span>
        {/if}

        {#if editMode}
            <input type="text" class="col-sm-6" bind:value={marker.text} placeholder="Description..."/>
        {:else}
            <span class="clickable" on:click={() => dispatcher('play', marker)}>{marker.text || 'Aucun titre'}</span>
        {/if}
        {#if editMode}
            <button class="no-background" on:click={() => markers.remove(marker.id)}><Trash2Icon size="18" /></button>
        {/if}
    </div>
    {/each}
{/if}

<div class="add-marker">
    <button on:click={() => dispatcher('addMarker')}>Ajouter un marqueur</button>
</div>


<style>
    .row {
        align-items: center;
    }
    .row.active {
        font-weight: bold;
    }
    .no-background {
        background: none;
        line-height: 0;
    }
    .add-marker {
        text-align: center;
        margin-top: 1rem;
    }
    .clickable {
        cursor: pointer;
    }
    .clickable:hover {
        text-decoration: underline;
    }
    .row.editMode .marker-time {
        min-width: 5rem;
    }
    .marker-time {
        display: inline-block;
        min-width: 4rem;
        margin-left: 1rem;
    }
</style>