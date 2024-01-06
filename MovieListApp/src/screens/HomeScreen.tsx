import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import GenreFilter from '../components/GenreFilter';

const HomeScreen: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['All']);

  const handleSelectGenres = (selectedGenres: string[]) => {
    setSelectedGenres(selectedGenres);
    
  };
  return (
    <View>
    <GenreFilter selectedGenres={selectedGenres} onSelectGenres={handleSelectGenres} />
    </View>
  );
};

export default HomeScreen;