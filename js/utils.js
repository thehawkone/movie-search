export const NO_POSTER = './assets/no-image-available.webp';

export function getPosterUrl(poster) {
    return poster !== 'N/A' ? poster : NO_POSTER;
}

export function debounce(func, delay) {
    let timerId;

    return function(...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => func.apply(this, args), delay);
    }
}