const STORAGE_KEY = 'movie-favorites';

export function loadFavorites() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error('Ошибка при загрузке избранных фильмов:', error);
        return [];
    }
}

export function saveFavorites(favorites) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Ошибка при сохранении избранных фильмов:', error);
    }
}