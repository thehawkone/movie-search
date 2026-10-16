import { searchMovies as fetchMovies } from "./api.js";
import { getMovieDetails } from "./api.js";
import { loadFavorites, saveFavorites } from "./model.js";

const state = {
    query: '',
    movies: [],
    loading: false,
    error: null,
    selectedMovie: null,
    favorites: [],
};

export function initStore() {
    state.favorites = loadFavorites();
    return state;
}

export function getState() {
    return state;
}

export function startSearch() {
    state.loading = true;
    state.error = null;
    state.movies = [];
}

export async function searchMovies(query) {
    state.query = query;
    state.loading = true;
    state.error = null;
    state.movies = [];

    try {
        const movies = await fetchMovies(query);
        state.movies = movies
    } catch (error) {
        state.error = error.message;
        state.movies = [];
    } finally {
        state.loading = false;
    }

    return state;
}

export async function openMovie(imdbID) {
    state.loading = true;
    state.error = null;

    try {
        state.selectedMovie =  await getMovieDetails(imdbID);
    } catch (error) {
        state.error = error.message;
        state.selectedMovie = null;
    } finally {
        state.loading = false;
    }

    return state;
}

export function toggleFavorite() {
    const movie = state.selectedMovie;
    if (!movie) return;

    const exists = state.favorites.some((item) => item.imdbID === movie.imdbID);
    if (exists) {
        state.favorites = state.favorites.filter((item) => item.imdbID !== movie.imdbID);
    } else {
        state.favorites = [
            ...state.favorites,
            {
                imdbID: movie.imdbID,
                Title: movie.Title,
                Year: movie.Year,
                Poster: movie.Poster,
            },
        ];
    }

    saveFavorites(state.favorites);
    return state;
}

export function getFavorites(imdbID) {
    return state.favorites.some((item) => item.imdbID === imdbID);
}