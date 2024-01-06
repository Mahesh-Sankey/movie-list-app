import React from 'react';
import {View,ScrollView,TouchableOpacity,Text,StyleSheet} from 'react-native';
interface GenreFilterProps {
  selectedGenres?: string[];
  onSelectGenres: (selectedGenres: string[]) => void;
}

const allGenres = [
  'All',
  'Action',
  'Comedy',
  'Horror',
  'Drama',
  'Sci-Fi',
  'Romance',
  'Korean',
  'Anime',
];

const GenreFilter: React.FC<GenreFilterProps> = ({
  selectedGenres = [],
  onSelectGenres,
}) => {
  const handleGenrePress = (genre: string) => {
    let updatedGenres;
    if (genre === 'All') {
      updatedGenres = ['All'];
    } else {
      updatedGenres = selectedGenres.includes(genre) ? ['All'] : [genre];
    }
    onSelectGenres(updatedGenres);
  };

  return (
    <View style={styles.genreContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        {allGenres.map(genre => (
          <TouchableOpacity
            key={genre}
            style={[
              styles.genre,
              (selectedGenres.includes(genre) ||
                (genre === 'All' && selectedGenres.length === 0)) &&
                styles.selectedGenre,
            ]}
            onPress={() => handleGenrePress(genre)}>
            <Text
              style={[
                styles.genreText,
                (selectedGenres.includes(genre) ||
                  (genre === 'All' && selectedGenres.length === 0)) &&
                  styles.selectedGenreText,
              ]}>
              {genre}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  genreContainer: {
    flexDirection: 'row',
    backgroundColor: '#242424',
    paddingVertical: 15,
  },
  scrollViewContent: {
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  genre: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    padding: 10,
    marginRight: 15,
    backgroundColor: '#484848',
  },
  selectedGenre: {
    backgroundColor: '#F0283C',
  },
  selectedGenreText: {
    color: '#F3F4F6',
    fontSize: 14,
    fontWeight: '800',
    paddingLeft: 8,
    paddingRight: 8,
    fontFamily: 'Amaranth-Bold',
  },
  genreText: {
    fontSize: 14,
    fontFamily: 'Amaranth-Regular',
    fontWeight: '400',
    paddingLeft: 8,
    paddingRight: 8,
    color: '#F5F5F5',
  },
});

export default GenreFilter;