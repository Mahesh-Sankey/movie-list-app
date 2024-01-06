import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {getMoviesByYear} from '../services/movieService';

const MovieCard = () => {
  const [moviesByYear, setMoviesByYear] = useState<{
    [key: number]: Array<Movie>;
  }>({});
  const [currentYear, setCurrentYear] = useState<number>(2012);
  const [loading, setLoading] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const debounce = (func: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const loadMovies = async (
    year: number,
    page: number,
    direction: 'next' | 'prev',
  ) => {
    try {
      setLoading(true);
      const loadedMovies = await getMoviesByYear(year, page);
      setMoviesByYear(prevMoviesByYear => {
        const updatedMoviesByYear = {...prevMoviesByYear};
        updatedMoviesByYear[year] = [
          ...(updatedMoviesByYear[year] || []),
          ...loadedMovies.slice(0, 20),
        ];
        return updatedMoviesByYear;
      });

      // Update current year based on scrolling direction
      if (direction === 'next') {
        setCurrentYear(year + 1);
      } else if (direction === 'prev' && currentYear > 2012) {
        setCurrentYear(year - 1);
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Scrolling up
  const handleScrollUp = debounce(() => {
    if (scrollViewRef.current) {
      const offsetY = scrollViewRef.current.contentOffset?.y;
      const layoutHeight = scrollViewRef.current.layoutMeasurement?.height;

      if (
        offsetY !== undefined &&
        layoutHeight !== undefined &&
        offsetY < layoutHeight * 2 &&
        currentYear > 2012 &&
        !loading
      ) {
        loadMovies(currentYear - 1, 1, 'prev');
      }
    }
  }, 500);

  // Scrolling down
  const handleScrollDown = debounce(() => {
    if (scrollViewRef.current) {
      const offsetY = scrollViewRef.current.contentOffset?.y;
      const contentHeight = scrollViewRef.current.contentSize?.height;
      const layoutHeight = scrollViewRef.current.layoutMeasurement?.height;

      if (
        offsetY !== undefined &&
        contentHeight !== undefined &&
        layoutHeight !== undefined &&
        offsetY > contentHeight - layoutHeight * 2 &&
        !loading
      ) {
        loadMovies(
          currentYear,
          Math.ceil(moviesByYear[currentYear]?.length || 0 / 20) + 1,
          'next',
        );
      }
    }
  }, 500);

  useEffect(() => {
    loadMovies(currentYear, 1, 'next');
  }, [currentYear]);

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.container}
      onScroll={event => {
        handleScrollDown();
        handleScrollUp();
      }}
      scrollEventThrottle={400}>
      {Object.keys(moviesByYear).map(year => (
        <View key={year} style={styles.yearContainer}>
          <Text style={styles.yearText}>{year}</Text>
          <View style={styles.movieContainer}>
            {moviesByYear[Number(year)].map((movie, index) => (
              <TouchableOpacity key={index} style={styles.movieCard}>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                  }}
                  style={styles.movieImage}
                />
                <View style={styles.movieDetails}>
                  <Text style={styles.title}>{movie.title}</Text>
                  <Text
                    style={
                      styles.ratings
                    }>{`Ratings: ${movie.vote_average}`}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      {loading && <ActivityIndicator style={styles.loadingIndicator} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 150,
    backgroundColor: '#121212'
  },
  yearContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  movieContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  movieCard: {
    width: '48%',
    height: 258,
    marginBottom: 15,
    backgroundColor: '#424242',
    borderRadius: 4,
    overflow: 'hidden',
  },
  movieImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  movieDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Amaranth-Regular',
    color: '#fff',
  },
  yearText: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Amaranth-Bold',
    color: '#ffffff',
  },
  ratings: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Amaranth-Regular',
  },
  loadingIndicator: {
    alignSelf: 'center',
    marginVertical: 10,
  },
});

export default MovieCard;