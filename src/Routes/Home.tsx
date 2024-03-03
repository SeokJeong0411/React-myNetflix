import { useQuery } from "react-query";
import { IGetMoviesResult, getMoives, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import Slider from "../Components/Slider";
import { useSetRecoilState } from "recoil";
import { nowPlayingAtom } from "../atoms";

/* --- CSS --- */
const Wrapper = styled.div``;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgImg: string }>`
  height: 100vh;
  background-color: red;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${(props) => props.bgImg});
  background-size: cover;
  background-position: center center;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  top: 50px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
`;

const BigMovieImg = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 36px;
  position: relative;
  top: -60px;
`;

const BigOverview = styled.p`
  position: relative;
  top: -60px;
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

/* --- Motion Variants --- */

function Home() {
  /* --- Motion Variants --- */

  const bigMovieMatch = useMatch("/movies/:movieId");
  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMoives);
  const { data: popularMovies, isLoading: isPopularMoviesLoading } = useQuery<IGetMoviesResult>(
    ["movies", "popularMovies"],
    getPopularMovies
  );
  const { data: topRatedMovies, isLoading: isTopRatedMoviesLoading } = useQuery<IGetMoviesResult>(
    ["movies", "topRatedMovies"],
    getTopRatedMovies
  );
  const { data: upcomingMovies, isLoading: isUpcomingMoviesLoading } = useQuery<IGetMoviesResult>(
    ["movies", "upcomingMovies"],
    getUpcomingMovies
  );

  // const setNowPlayingAtom = useSetRecoilState(nowPlayingAtom);
  //
  // useEffect(() => {
  //   if (data) {
  //     console.log("reload");
  //     setNowPlayingAtom(data?.results);
  //   }
  // }, [isLoading]);

  const navigate = useNavigate();

  const onOverlayClicked = () => {
    navigate(-1);
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId && data?.results.find((movie) => movie.id + "" === bigMovieMatch.params.movieId);

  return (
    <Wrapper style={{ height: "200vh" }}>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner bgImg={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>

          {/* 슬라이더 */}
          <Slider title="Now Playing Movies" data={data ? data?.results : []} />
          {isPopularMoviesLoading ? null : (
            <Slider title="Popular Movies" data={popularMovies ? popularMovies?.results : []} />
          )}
          {isTopRatedMoviesLoading ? null : (
            <Slider title="Top Rated Movies" data={topRatedMovies ? topRatedMovies?.results : []} />
          )}
          {isUpcomingMoviesLoading ? null : (
            <Slider title="Upcoming Movies" data={upcomingMovies ? upcomingMovies?.results : []} />
          )}

          {/* 상세팝업 */}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay onClick={onOverlayClicked} animate={{ opacity: 1 }} exit={{ opacity: 0 }}></Overlay>
                <BigMovie layoutId={bigMovieMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <BigMovieImg
                        style={{ backgroundImage: `url(${makeImagePath(clickedMovie.backdrop_path, "w500")})` }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
