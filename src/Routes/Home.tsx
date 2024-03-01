import { useQuery } from "react-query";
import { IGetMoviesResult, getMoives } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

/* --- CSS --- */
const Wrapper = styled.div`
  /* background-color: black; */
`;

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

const Slider = styled.div`
  position: relative;
`;

const SliderRow = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
  top: -100px;
`;

const SliderBox = styled(motion.div)<{ bgImg: string }>`
  background-color: white;
  background-image: url(${(prev) => prev.bgImg});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const SliderBoxInfo = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    text-align: center;
    font-size: 18px;
  }
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
const BoxVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -40,
    transition: { delay: 0.2, type: "tween" },
  },
};

const InfoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.2, type: "tween" },
  },
};

const SLIDER_OFFSET = 6;

function Home() {
  /* --- Motion Variants --- */
  const rowVariants = {
    hidden: { x: window.innerWidth + 10 },
    visible: { x: 0 },
    exit: { x: -window.innerWidth - 10 },
  };

  const bigMovieMatch = useMatch("/movies/:movieId");
  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMoives);
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / SLIDER_OFFSET) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const [leaving, setLeaving] = useState(false);

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClicked = () => {
    navigate(-1);
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId && data?.results.find((movie) => movie.id + "" === bigMovieMatch.params.movieId);
  console.log(clickedMovie);
  return (
    <Wrapper style={{ height: "200vh" }}>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner onClick={increaseIndex} bgImg={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <SliderRow
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 4 }}
              >
                {data?.results
                  .slice(1)
                  .slice(SLIDER_OFFSET * index, SLIDER_OFFSET * index + SLIDER_OFFSET)
                  .map((movie) => (
                    <SliderBox
                      key={movie.id}
                      layoutId={movie.id + ""}
                      bgImg={makeImagePath(movie.backdrop_path || "", "w500")}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={BoxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                    >
                      <SliderBoxInfo variants={InfoVariants}>
                        <h4>{movie.title}</h4>
                      </SliderBoxInfo>
                    </SliderBox>
                  ))}
              </SliderRow>
            </AnimatePresence>
          </Slider>
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
