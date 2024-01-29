import React, { useState } from 'react';
import { useEffect } from 'react';
import MovieCard from './MovieCard';
import './App.css';
import SearchIcon from './search.svg';
//473a75ac

const API_URL = 'http://www.omdbapi.com?apikey=473a75ac';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [SearchTerm, setSearchTerm] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  const searchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();
    
    setMovies(data.Search);
    
  }

  const getMovieDetails = async (id) => {
    const response = await fetch(`${API_URL}&i=${id}`);
    const data = await response.json();
    setSelectedMovie(data);
  };

  const resetSelectedMovie = () => {
    setSelectedMovie(null);
  };


  
  useEffect(() => {
    const startPage = async (year) => {
      const response = await fetch(`${API_URL}&s=${year}`);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search || []);
      } else {
        console.error('Error fetching movies:', data.Error);
      }
    };

    //Setting the year to display movies at the start
    const targetYear = '2024';

    startPage(targetYear);
  }, []);
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      { searchMovies(SearchTerm) }
    }
  }

  const handleMovieClick = (id) => {
    getMovieDetails(id);
  };

  return (
    <div className="app">
      <h1>MoviesWiki</h1>
      <h2 className="subtitle">Search for your favourite movies, tv series or games</h2>

      <div className="search">
        <input
          placeholder="Search For Movies By Title"
          value={SearchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <img
          src={SearchIcon}
          alt="Search"
          onClick={() => {searchMovies(SearchTerm) }}
        />
      </div>

      {selectedMovie ? (
        <div className="modal">
          {/* Render detailed information about the selected movie */}
          <h2>{selectedMovie.Title}</h2>
          <p>{selectedMovie.Plot}</p>
          <button onClick={resetSelectedMovie}>Close</button>
        </div>
      ) : (
        <div className="container">
          {movies?.length > 0 ? (
            movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onClick={() => handleMovieClick(movie.imdbID)}
              />
            ))
          ) : (
            <div className="empty">
              <h2>No Movies Found</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;