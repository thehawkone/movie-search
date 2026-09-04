import { searchMovies } from "./api.js";

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

    const logo = document.querySelector('.header__logo')

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

        const query = document.getElementById('search-input').ariaValueMax.trim();
        if (!query) return;

        try {
            const movies = await searchMovies(query);
            console.log(movies);
        } catch (error) {
            console.error(error.message);
        }
    });

    logo.addEventListener('click', (e) => {
        e.preventDefault();
        showView('search');
    });

    showView('search');
}