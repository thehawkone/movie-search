# Movie Search

Приложение для поиска фильмов на чистом JavaScript: строка поиска, карточки, страница деталей и избранное. Данные — [OMDb API](https://www.omdbapi.com/).

## Возможности

- Поиск фильмов по названию (кнопка / Enter и ввод с debounce)
- Сетка карточек: постер, название, год
- Заглушка, если постер не загрузился
- Страница деталей: рейтинг, режиссёр, актёры, жанр, описание
- Избранное в localStorage — список не пропадает после перезагрузки
- Состояния загрузки и ошибок

## Стек

- HTML, SCSS, CSS
- Vanilla JavaScript (ES modules)
- OMDb API

## Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone <url-репозитория>
cd movie-search
```

### 2. Получить API-ключ

1. Зарегистрируйся на [omdbapi.com](https://www.omdbapi.com/apikey.aspx)
2. Подтверди ключ по письму (бесплатный ключ приходит на почту)

### 3. Настроить конфиг

```bash
cp js/config.example.js js/config.js
```

Открой `js/config.js` и вставь свой ключ:

```javascript
export const API_KEY = 'твой_ключ';
export const API_BASE_URL = 'https://www.omdbapi.com/';
```

### 4. Запустить локальный сервер

ES modules не работают через `file://`, нужен локальный сервер:

```bash
npx serve .
```

Или с Live Server в VS Code / Cursor — открой `index.html`.

Приложение будет доступно по адресу вроде `http://localhost:3000`.

### 5. (Опционально) Скомпилировать SCSS

Если меняешь стили в `styles/main.scss`:

```bash
npx sass styles/main.scss styles/main.css
```

## Как пользоваться

1. Введи название фильма (от 3 символов) — поиск запустится сам через ~0.5 с.
2. Или нажми **Поиск** / Enter — запрос уйдёт сразу.
3. Кликни по карточке, чтобы открыть детали.
4. **Добавить в избранное** сохраняет фильм. Список — во вкладке **Избранное**.
5. **Назад** возвращает туда, откуда открыли детали (поиск или избранное).

## Сохранение данных

Избранное хранится в **localStorage** браузера под ключом `movie-favorites`.

- Сохраняется после каждого добавления / удаления.
- После обновления страницы (F5) список остаётся.
- Если очистить данные сайта в браузере, избранное будет удалено.

## Структура проекта

```
movie-search/
├── index.html              # разметка
├── js/
│   ├── app.js              # точка входа
│   ├── api.js              # запросы к OMDb
│   ├── store.js            # состояние приложения
│   ├── ui.js               # рендер и обработчики
│   ├── utils.js            # debounce, заглушка постера
│   ├── model.js            # localStorage (избранное)
│   ├── config.js           # API-ключ (не в git)
│   └── config.example.js
├── styles/
│   ├── main.scss           # исходные стили
│   └── main.css            # скомпилированные стили
└── assets/
    └── no-image-available.webp
```

## Архитектура

```
app.js → initStore(), initUI()
store.js → state, searchMovies(), openMovie(), toggleFavorite()
api.js → searchMovies(), getMovieDetails()
ui.js → render, события, debounce
utils.js → debounce(), getPosterUrl()
model.js → избранное в localStorage
```

**Состояние:** `query`, `movies`, `selectedMovie`, `favorites`, `loading`, `error`

## Лицензия

Учебный проект. API-ключ храни только локально в `js/config.js`.
