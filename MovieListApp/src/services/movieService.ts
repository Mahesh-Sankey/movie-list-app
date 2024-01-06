import axios from 'axios';

const apiKey = '2dca580c2a14b55200e784d157207b4d';

const getMoviesByYear = async (year: number, page: number) => {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&primary_release_year=${year}&page=${page}&vote_count.gte=100`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export { getMoviesByYear };