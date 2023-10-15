import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import { addTrailerVideo } from "../utils/moviesSlice";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();
  const trailerVideo = useSelector((store) => store.movies.trailerVideo);

  // Created a separate function to handle the API call. This makes the code more modular and easier to test.
  const fetchMovieVideos = async () => {
    try {
      // Using template literals to construct the API URL. This makes the code cleaner and easier to read.
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
        API_OPTIONS
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      // Added error handling to the API call. This ensures that the application can gracefully handle any issues that might arise.
      console.error('Error fetching movie videos:', error);
    }
  };

  const getMovieVideos = async () => {
    const videos = await fetchMovieVideos();
    const filterData = videos.filter((video) => video.type === "Trailer");
    const trailer = filterData.length ? filterData[0] : videos[0];
    dispatch(addTrailerVideo(trailer));
  };

  // Added movieId and trailerVideo to the dependency array of the useEffect hook. This ensures that the effect will run whenever either movieId or trailerVideo changes.
  useEffect(() => {
    if (!trailerVideo) {
      getMovieVideos();
    }
  }, [movieId, trailerVideo]);
};

export default useMovieTrailer;
