export const NO_POSTER = './assets/no-image-available.webp';

export function getPosterUrl(poster) {
    return poster !== 'N/A' ? poster : NO_POSTER;
}