import { get, writable } from 'svelte/store';
import markersStore from './markers';
import audioStore from './audio';

/**
 * @typedef {import('./markers').Marker} Marker
 */

function createStore() {
    let timeoutId;
    let audioUnsubscriber;
    let markersUnsubscriber;
    const store = writable(false);
    const { subscribe, set } = store;

    function clear() {
        clearLoops();
        if (audioUnsubscriber) {
            audioUnsubscriber();
            audioUnsubscriber = null;
        }
    }

    function clearLoops() {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (markersUnsubscriber) {
            markersUnsubscriber();
            markersUnsubscriber = null;
        }
    }

    /**
     * @param {HTMLAudioElement} audio
     * @param {number[]} range
     */
    function safeSetCurrentTime(audio, range) {
        const [from, to] = range;

        if (audio.currentTime >= from && audio.currentTime < to ) return;

        audio.currentTime = from;
    }

    /**
     * 
     * @param {HTMLAudioElement} audio 
     */
    function loop(audio) {
        clearLoops();
        const current = markersStore.getCurrentMarker(audio);
        const ranges = markersStore.getLoopRanges(audio);
        const currentRangeIndex = current && current.enabled
            ? ranges.findIndex(r => r[0] == current.time)
            : 0;
        const [_from, to] = ranges[currentRangeIndex];
        const nextRangeIndex = currentRangeIndex === ranges.length - 1 ? 0 : currentRangeIndex + 1;

        safeSetCurrentTime(audio, ranges[currentRangeIndex]);

        timeoutId = setTimeout(() => {
            timeoutId = null;
            safeSetCurrentTime(audio, ranges[nextRangeIndex]);
            loop(audio);
        }, (to - audio.currentTime) * 1000);
    }

    return {
        subscribe,
        toggle() {
            get(store) ? this.stop() : this.start();
        },
        start() {
            set(true);
            const audio = get(audioStore);

            audioUnsubscriber = audioStore.paused.subscribe(paused => {
                if (paused) {
                    return clearLoops();
                }

                markersUnsubscriber = markersStore.subscribe(() => loop(audio));
            });

        },
        stop() {
            set(false);
            clear();
        },
    };
}

export default createStore();