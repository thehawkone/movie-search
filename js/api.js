import { API_KEY, API_BASE_URL } from './config.js';

export async function searchMovies(query) {
    const url = `${API_BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Не удалось выполнить поиск')
    }

    const data = await response.json();

    if (data.Response === 'False') {
        throw new Error(data.Error || "Фильмы не найдены")
    }

    return data.Search;
}

export async function getMovieDetails(imdbID) {
    const url = `${API_BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Не удалось загрузить детали фильма');
    }

    const data = await response.json();

    if (data.Response === 'False') {
        throw new Error(data.Error || 'Фильм не найден');
    }

    return data;
}