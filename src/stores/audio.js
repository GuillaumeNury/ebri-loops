import { get, writable, derived } from 'svelte/store';

/**
 * @typedef {import('./markers').Marker} Marker
 */

function createStore() {
    /**
     * @type {HTMLMediaElement}
     */
    const defaultValue = null;
    const store = writable(defaultValue);
    const { subscribe, set, update } = store;
    let timeoutId;

    function clear() {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }

    let _audioEventUnsubscriber;

    return {
        paused: derived(store, audio => !audio || audio.paused),
        subscribe,
        update,
        reset() {
            const current = get(store);
            if (current) {
                current.pause();
            }
            if (_audioEventUnsubscriber) {
                _audioEventUnsubscriber();
                _audioEventUnsubscriber = null;
            }
            set(null);
        },
        /**
         * 
         * @param {HTMLMediaElement} val 
         */
        set(val) {
            const _audioEventCallback = () => set(val);
            val.addEventListener("loadedmetadata", _audioEventCallback);
            val.addEventListener("timeupdate", _audioEventCallback);

            _audioEventUnsubscriber = () => {
                val.removeEventListener("loadedmetadata", _audioEventCallback);
                val.removeEventListener("timeupdate", _audioEventCallback);
            }
        },
        play() {
            const audio = get(store);
            if (!audio) return;

            audio.play();
            clear();
        },
        /**
         * 
         * @param {Marker} marker 
         */
        playFromMarker(marker) {
            const audio = get(store);
            audio.currentTime = marker.time;
            this.play();
        },
        pause() {
            const audio = get(store);
            if (!audio) return;

            audio.pause();
            clear();
        },
        loop(from, to) {
            const audio = get(store);
            if (!audio) return;

            clear();
            audio.currentTime = from;
            audio.play();
            timeoutId = setTimeout(() => {
                timeoutId = null;
                this.loop(from, to);
            }, (to - from) * 1000);
        }
    };
}

export default createStore();