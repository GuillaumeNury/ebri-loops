 /**
 * @typedef {import('./stores/markers').Marker} Marker
 */

/**
 * 
 * @param {string} filename
 */
export function loadMarkers(filename) {
    const markersString = localStorage.getItem(`track:${filename}`);
    if (!markersString) return [];
    return markersString
        .split('|')
        .map(part => part.split(':'))
        .map(([time, text]) => ({ time: Number(time), text: JSON.parse(text) }))
}

/**
 * 
 * @param {string} filename
 */
export function saveMarkers(filename) {
    /**
     * @param {Marker[]} markers
     */
    function _saveMarkers(markers) {
        const markersString = markers.map(({ time, text }) => `${time}:${JSON.stringify(text)}`).join('|');
        localStorage.setItem(`track:${filename}`, markersString);
    }

    return _saveMarkers;
}