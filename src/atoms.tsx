import { atom } from "recoil";
import { IResults } from "./api";

export const nowPlayingAtom = atom<IResults[]>({
  key: "nowPlaying",
  default: [],
});
