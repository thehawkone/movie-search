import { getState, searchMovies, startSearch } from './store.js';
import { NO_POSTER, getPosterUrl } from './utils.js';

export function initUI() {
    let previousView = 'search';

    const searchView = document.getElementById('search-view');
    const detailsView = document.getElementById('details-view');
    const favoritesView = document.getElementById('favorites-view');

    const searchBtn = document.getElementById('search-btn');
    const favoritesBtn = document.getElementById('favorites-btn');
    const backBtn = document.getElementById('back-btn');

    const searchForm = document.getElementById('search-form');
    const movieGrid = document.getElementById('movie-grid');
    const favoritesGrid = document.getElementById('favorites-grid');

    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const noResultsEl = document.getElementById('no-results');

    const logo = document.querySelector('.header__logo');

    function showView(viewName) {
        searchView.hidden = viewName !== 'search';
        detailsView.hidden = viewName !== 'details';
        favoritesView.hidden = viewName !== 'favorites';

        searchBtn.classList.toggle('nav__btn--active', viewName === 'search');
        favoritesBtn.classList.toggle('nav__btn--active', viewName === 'favorites');
    };

    searchBtn.addEventListener('click', () => showView('search'));
    favoritesBtn.addEventListener('click', () => showView('favorites'));
    backBtn.addEventListener('click', () => showView(previousView));

    movieGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.movie-card');
        if (!card) return;

        previousView = 'search';
        showView('details');
    });

    favoritesGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.movie-card');
        if (!card) return;

        previousView = 'favorites';
        showView('details');
    })

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const query = document.getElementById('search-input').value.trim();
        if (!query) return;

        startSearch();
        renderStatus();
        await searchMovies(query);
        renderStatus();
        renderMovies();
        console.log(getState().movies);  // ← добавь эту строку

    });

    logo.addEventListener('click', (e) => {
        e.preventDefault();
        showView('search');
    });

    function createMovieCard(movie) {
        const card = document.createElement('article');
        card.className = 'movie-card';
        card.dataset.imdbID = movie.imdbID;

        const posterSrc = movie.Poster !== 'N/A' ? movie.Poster : NO_POSTER;

        card.innerHTML = `
            <img 
                src="${posterSrc}"
                alt="Постер ${movie.Title}"
                class="movie-card__poster"
                onerror="this.onerror=null; this.src='${NO_POSTER}'"
            >
            <h3 class="movie-card__title">${movie.Title}</h3>
            <p class="movie-card__year">${movie.Year}</p>
        `;

        return card;
    }

    function renderStatus() {
        const { loading, error, movies } = getState();

        loadingEl.hidden = !loading;
        errorEl.hidden = !error;
        noResultsEl.hidden = loading || error || movies.length > 0;

        if (error) {
            errorEl.textContent = error;
        }
    }

    function renderMovies() {
        const { movies } = getState();

        movieGrid.innerHTML = '';

        movies.forEach((movie) => {
            movieGrid.appendChild(createMovieCard(movie));
        });
    }

    showView('search');
}