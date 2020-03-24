/**
 * 
 * @param {number} time 
 * @param {boolean} displayMs 
 */
export function formatTime(time, displayMs = false) {
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor((time - hours * 60 * 60) / 60);
    const seconds = Math.floor(time - minutes * 60 - hours * 60 * 60);
    const milliseconds = Math.floor(1000 * (time - (seconds + minutes * 60 - hours * 60 * 60)));
    const pad = (n, l = 2) => n.toString().padStart(l, '0');

    let result = '';
    if (hours) {
        result += pad(hours) + ':';
    }
    return (hours ? pad(hours) + ':' : '')
        + pad(minutes) + ':'
        + pad(seconds)
        + (displayMs ? '.' + pad(milliseconds, 3) : '');
}