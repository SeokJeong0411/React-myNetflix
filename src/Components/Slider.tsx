import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { nowPlayingAtom } from "../atoms";
import { useRecoilValue } from "recoil";
import { IResults } from "../api";
import { makeImagePath } from "../utils";
import { useNavigate } from "react-router-dom";

/* ----- CSS ----- */
const Wrapper = styled.div`
  margin-bottom: 60px;
`;

// 슬라이더 명
const SliderTitle = styled.h2`
  font-size: 24px;
  font-weight: bolder;
  padding: 10px 100px;
`;

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  height: 200px;
`;

// 슬라이더 좌우 화살표
const SliderArrBox = styled.div`
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SliderArr = styled.svg`
  width: 100px;
  stroke: rgba(255, 255, 255, 0.5);
  cursor: pointer;
`;

const SliderRow = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  width: 100%;
  height: 100%;
  position: absolute;
`;

// 슬라이더 내부 박스
const SliderBox = styled(motion.div)`
  background-color: ${(prev) => prev.theme.black.darker};
  height: 200px;
  transform-origin: bottom center;

  &:first-child {
    transform-origin: bottom left;
  }
  &:last-child {
    transform-origin: bottom right;
  }
`;
const SliderBoxImg = styled(motion.div)<{ bgImg: string }>`
  background-color: ${(prev) => prev.theme.black.darker};
  background-image: url(${(prev) => prev.bgImg});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;
`;
const SliderBoxInfo = styled(motion.div)`
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 40px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  h4 {
    font-size: 15px;
    padding: auto;
  }
`;

/* ----- Interface -----  */
interface ISliderCustom {
  back: boolean;
  leaving: boolean;
}

/* ----- Default Param ----- */
const SLIDER_OFFSET = 6;

function Slider({ title, data }: { title: string; data: IResults[] }) {
  /* ---- Variants ----- */
  const rowVariants = {
    hidden: ({ back }: ISliderCustom) => ({
      x: back ? -window.innerWidth + 200 - 10 : window.innerWidth - 200 + 10,
    }),
    visible: { x: 0 },
    exit: ({ back }: ISliderCustom) => ({ x: back ? window.innerWidth - 200 + 10 : -window.innerWidth + 200 - 10 }),
  };

  const BoxVariants = {
    normal: { scale: 1 },
    hover: ({ leaving }: ISliderCustom) => {
      return leaving
        ? {}
        : {
            scale: 1.3,
            transition: { delay: 0.2, type: "tween" },
          };
    },
  };

  const InfoVariants = {
    hover: ({ leaving }: ISliderCustom) => {
      return leaving
        ? {}
        : {
            opacity: 1,
            transition: { delay: 0.2, type: "tween", duraiont: 0.5 },
          };
    },
  };

  /* ----- Router ----- */
  const navigate = useNavigate();

  /* ----- 영화 정보 ----- */
  // const data = useRecoilValue<IResults[]>(nowPlayingAtom);

  /* ----- 슬라이더 ----- */
  const [index, setIndex] = useState(0); // 슬라이더 인덱스
  const [leaving, setLeaving] = useState(false); // 슬라이더 이동 여부
  const [back, setBack] = useState(false); // 슬라이더 방향
  // 슬라이더 이동 여부 토글
  const toggleLeaving = () => setLeaving((prev) => !prev);
  // 슬라이더 인덱스 증가
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(false);
      const totalMovies = data.length - 1;
      const maxIndex = Math.floor(totalMovies / SLIDER_OFFSET) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  // 슬라이더 인덱스 감소
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(true);
      const totalMovies = data.length - 1;
      const maxIndex = Math.floor(totalMovies / SLIDER_OFFSET) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  // 박스 클릭 시 큰 화면
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <Wrapper>
      <SliderTitle>{title}</SliderTitle>
      <SliderWrapper>
        <SliderArrBox>
          <SliderArr viewBox="0 0 24 24" stroke="rgba(255,255,255,0.5)" onClick={decreaseIndex}>
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z"
                fill="#0F0F0F"
              ></path>
            </g>
          </SliderArr>
        </SliderArrBox>
        <div style={{ width: "100%", position: "relative", overflow: leaving ? "hidden" : "visible" }}>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={{ back, leaving }}>
            <SliderRow
              key={index}
              custom={{ back, leaving }}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 2 }}
            >
              {data
                ?.slice(1)
                .slice(SLIDER_OFFSET * index, SLIDER_OFFSET * index + SLIDER_OFFSET)
                .map((movie) => (
                  <SliderBox
                    variants={BoxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    custom={{ back, leaving }}
                  >
                    <SliderBoxImg
                      key={movie.id}
                      layoutId={movie.id + ""}
                      bgImg={makeImagePath(movie.backdrop_path || "", "w500")}
                      onClick={() => onBoxClicked(movie.id)}
                    />
                    <SliderBoxInfo variants={InfoVariants} custom={{ back, leaving }}>
                      <h4>{movie.title}</h4>
                    </SliderBoxInfo>
                  </SliderBox>
                ))}
            </SliderRow>
          </AnimatePresence>
        </div>
        <SliderArrBox>
          <SliderArr viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onClick={increaseIndex}>
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M7.82054 20.7313C8.21107 21.1218 8.84423 21.1218 9.23476 20.7313L15.8792 14.0868C17.0505 12.9155 17.0508 11.0167 15.88 9.84497L9.3097 3.26958C8.91918 2.87905 8.28601 2.87905 7.89549 3.26958C7.50497 3.6601 7.50497 4.29327 7.89549 4.68379L14.4675 11.2558C14.8581 11.6464 14.8581 12.2795 14.4675 12.67L7.82054 19.317C7.43002 19.7076 7.43002 20.3407 7.82054 20.7313Z"
                fill="#0F0F0F"
              ></path>{" "}
            </g>
          </SliderArr>
        </SliderArrBox>
      </SliderWrapper>
    </Wrapper>
  );
}

export default Slider;
