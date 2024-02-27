import apiOptions from "./api_key";

const options = apiOptions;
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMoives() {
  return fetch(`${BASE_PATH}/movie/now_playing?language=en-US&page=1&region=kr`, options).then((response) =>
    response.json()
  );
}
