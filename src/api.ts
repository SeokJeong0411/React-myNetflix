import apiOptions from "./api_key";

const options = apiOptions;
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: {
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
  }[];
  total_pages: number;
  total_results: number;
}

export function getMoives() {
  return fetch(`${BASE_PATH}/movie/now_playing?language=en-US&page=1&region=kr`, options).then((response) =>
    response.json()
  );
}
