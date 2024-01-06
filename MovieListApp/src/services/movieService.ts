import axios from 'axios';

const apiKey = '2dca580c2a14b55200e784d157207b4d';

const getMoviesByYear = async (year: number, page: number, genre: string) => {
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&primary_release_year=${year}&page=${page}&vote_count.gte=100`;

  // If genre is not 'All', add genre filter
  if (genre !== 'All') {
    // Fetch genre id based on genre name
    const genreList = await getGenreList();
    const selectedGenre = genreList.find((g) => g.name === genre);

    if (selectedGenre) {
      url += `&with_genres=${selectedGenre.id}`;
    }
  }

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

const getGenreList = async () => {
  const url = 'https://api.themoviedb.org/3/genre/movie/list';
  try {
    const response = await axios.get(url, { params: { language: 'en', api_key: apiKey } });
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genre list:', error);
    throw error;
  }
};

export { getMoviesByYear, getGenreList };