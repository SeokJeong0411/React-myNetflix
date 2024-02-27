import { useQuery } from "react-query";
import { getMoives } from "../api";

function Home() {
  const { data, isLoading } = useQuery(["movies", "nowPlaying"], getMoives);

  return <div style={{ height: "200vh" }}></div>;
}

export default Home;
