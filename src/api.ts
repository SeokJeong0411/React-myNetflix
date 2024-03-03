import apiOptions from "./api_key";

const options = apiOptions;
const BASE_PATH = "https://api.themoviedb.org/3";

/* ----- Interface ----- */
export interface IResults {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IResults[];
  total_pages: number;
  total_results: number;
}

/* ----- API ----- */
/* Now Playing */
export function getMoives() {
  return fetch(`${BASE_PATH}/movie/now_playing?language=en-US&page=1&region=kr`, options).then((response) =>
    response.json()
  );
}

/* Popular */
export function getPopularMovies() {
  return fetch(`${BASE_PATH}/movie/popular?language=en-US&page=1&region=kr`, options).then((response) =>
    response.json()
  );
}

/* Top Rated */
export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?language=en-US&page=1&region=kr`, options).then((response) =>
    response.json()
  );
}

/* Upcoming */
export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?language=en-US&page=1&region=kr`, options).then((response) =>
    response.json()
  );
}
