<script>
    import { createEventDispatcher } from 'svelte';

    let inputFile;

    const dispatcher = createEventDispatcher();
</script>

<div class="file-picker">
    <button class="primary" on:click={() => inputFile.click()}>Choisir un fichier</button>
    <input bind:this={inputFile} type="file" on:change={evt => dispatcher('file', evt.target.files[0])} accept=".mp3" />
</div>

<style>
    input {
        display: none;
    }
    .file-picker {
        text-align: center;
        margin-top: 40vh;
    }
</style>