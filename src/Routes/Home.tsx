import { useQuery } from "react-query";
import { IGetMoviesResult, getMoives } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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

const SliderBox = styled(motion.div)`
  background-color: white;
  height: 200px;
`;

/* --- Motion Variants --- */
const rowVariants = {
  hidden: { x: window.innerWidth + 10 },
  visible: { x: 0 },
  exit: { x: -window.innerWidth - 10 },
};

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMoives);

  const [index, setIndex] = useState(0);

  const increaseIndex = () => {
    setIndex((prev) => prev + 1);
  };

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
            <AnimatePresence>
              <SliderRow
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 4 }}
              >
                <SliderBox></SliderBox>
                <SliderBox></SliderBox>
                <SliderBox></SliderBox>
                <SliderBox></SliderBox>
                <SliderBox></SliderBox>
                <SliderBox></SliderBox>
              </SliderRow>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
