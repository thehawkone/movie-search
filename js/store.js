import { searchMovies as fetchMovies } from "./api.js";

const state = {
    query: '',
    movies: [],
    loading: false,
    error: null,
};

export function initStore() {
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
