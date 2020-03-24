import { derived, get, writable } from 'svelte/store';

/**
 * @typedef Marker
 * @type {object}
 * @property {number} id
 * @property {number} time
 * @property {boolean} enabled
 * @property {string} text
 */

let globalId = 0;

function createStore() {
    /**
     * @type {Marker[]}
     */
    const defaultValue = [];
    const store = writable(defaultValue)
    const { subscribe, set, update } = store;

    const enabledMarkers = derived(store, markers => markers.filter(m => m.enabled));

    /**
     * 
     * @param {HTMLAudioElement} audio 
     */
    function getLoopRanges(audio) {
        /**
         * @type {Marker[]}
         */
        const markers = get(enabledMarkers);

        if (!markers.length) {
            return [[0, audio.duration]];
        }

        return markers.map(m => getMarkerRange(m.id, audio));
    }

    /**
     * 
     * @param {number} markerId
     * @param {HTMLAudioElement} audio
     */
    function getMarkerRange(markerId, audio) {
        /**
         * @type {Marker[]}
         */
        const markers = get(store);
        const index = markers.findIndex(m => m.id === markerId);

        if (index === -1) {
            throw new Error('[getMarkerRange] Wrong markerId.')
        }

        const endTime = index === markers.length - 1 ? audio.duration : markers[index + 1].time

        return [markers[index].time, endTime];
    }

    /**
     * 
     * @param {HTMLAudioElement} audio
     */
    function getCurrentMarker(audio) {
        /**
         * @type {Marker[]}
         */
        const markers = get(store);
        const beforeAudio = markers.filter(m => m.time <= audio.currentTime);

        return beforeAudio[beforeAudio.length - 1];
    }

    return {
        subscribe,
        set,
        add(time, text = '') {
            update(
                existingMarkers => [
                    ...existingMarkers,
                    { id: globalId++, time, enabled: false, text }
                ].sort((m1, m2) => m1.time - m2.time),
            );
        },
        remove(id) {
            update(existingMarkers => existingMarkers.filter(m => m.id !== id));
        },
        enabledMarkers,
        getLoopRanges,
        getCurrentMarker,
        /**
         * @param {HTMLAudioElement} audio
         * @param {Marker} marker
         */
        isCurrentMarker(audio, marker) {
            const current = getCurrentMarker(audio);
            return !!current && current.id === marker.id;
        }
    };
}

export default createStore();