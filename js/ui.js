import { getState, searchMovies, startSearch, openMovie, toggleFavorite, getFavorites } from './store.js';
import { NO_POSTER, getPosterUrl, debounce } from './utils.js';

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

    const searchInput = document.getElementById('search-input');

    const logo = document.querySelector('.header__logo');

    function showView(viewName) {
        searchView.hidden = viewName !== 'search';
        detailsView.hidden = viewName !== 'details';
        favoritesView.hidden = viewName !== 'favorites';

        searchBtn.classList.toggle('nav__btn--active', viewName === 'search');
        favoritesBtn.classList.toggle('nav__btn--active', viewName === 'favorites');
    };

    searchBtn.addEventListener('click', () => showView('search'));
    favoritesBtn.addEventListener('click', () =>  {
            showView('favorites');
            renderFavorites();
        }
    );
    backBtn.addEventListener('click', () => showView(previousView));

    movieGrid.addEventListener('click', async (e) => {
        const card = e.target.closest('.movie-card');
        if (!card) return;

        const imdbID = card.dataset.imdbID;
        if (!imdbID) return;

        previousView = 'search';
        showView('details');

        await openMovie(imdbID);
        renderStatus();
        renderDetails();
    });

    favoritesGrid.addEventListener('click', async (e) => {
        const card = e.target.closest('.movie-card');
        if (!card) return;

        const imdbID = card.dataset.imdbID;
        if (!imdbID) return;

        previousView = 'favorites';
        showView('details');

        await openMovie(imdbID);
        renderStatus();
        renderDetails();
    })

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const query = document.getElementById('search-input').value.trim();
        await runSearch(query);
    });

    logo.addEventListener('click', (e) => {
        e.preventDefault();
        showView('search');
    });

    document.getElementById('favorite-btn').addEventListener('click', () => {
        toggleFavorite();
        renderFavoriteBtn();
        renderFavorites();
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        if (query.length < 3) return;
        
        runSearchDebounced(query);
    });

    async function runSearch(query) {
        if (!query) return;

        startSearch();
        renderStatus();
        await searchMovies(query);
        renderStatus();
        renderMovies();
    }

    const runSearchDebounced = debounce((query) => runSearch(query), 500);

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

    function renderFavorites() {
        const { favorites } = getState();
        favoritesGrid.innerHTML = '';

        favorites.forEach((movie) => {
            favoritesGrid.appendChild(createMovieCard(movie));
        });
    }
    
    function renderFavoriteBtn() {
        const { selectedMovie } = getState();
        const btn = document.getElementById('favorite-btn');
        if (!selectedMovie) return;

        
        btn.textContent = getFavorites(selectedMovie.imdbID)
         ? 'Удалить из избранного'
         : 'Добавить в избранное';
    }


    function renderDetails() {
        const { selectedMovie } = getState();
        if (!selectedMovie) return;

        const posterSrc = selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : NO_POSTER;
        
        document.getElementById('detail-poster').src = posterSrc;
        document.getElementById('detail-poster').alt = selectedMovie.Title;
        document.getElementById('detail-title').textContent = selectedMovie.Title;
        document.getElementById('detail-rating').textContent = `Рейтинг: ${selectedMovie.imdbRating}`;
        document.getElementById('detail-director').textContent = `Режиссёр: ${selectedMovie.Director}`;
        document.getElementById('detail-actors').textContent = `В ролях: ${selectedMovie.Actors}`;
        document.getElementById('detail-year').textContent = 'Год: ' + selectedMovie.Year;
        document.getElementById('detail-genre').textContent = 'Жанр: ' + selectedMovie.Genre;
        document.getElementById('detail-plot').textContent = 'Описание: ' + selectedMovie.Plot;
        renderFavoriteBtn();
    }

    renderFavorites();
    showView('search');
}