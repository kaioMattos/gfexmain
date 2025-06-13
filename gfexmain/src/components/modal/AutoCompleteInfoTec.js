import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

export default function FreeSoloCreateOption() {
  const [value, setValue] = React.useState(null);

  return (
    <Autocomplete
      value={value}
      size="small"
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            Valor: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            Valor: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.Valor);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            Valor: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={top100Films}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.Valor;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.Valor}
          </li>
        );
      }}      
      renderInput={(params) => (
        <TextField {...params} placeholder="Pesquisar" />
      )}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { Valor: 'The Shawshank Redemption', year: 1994 },
  { Valor: 'The Godfather', year: 1972 },
  { Valor: 'The Godfather: Part II', year: 1974 },
  { Valor: 'The Dark Knight', year: 2008 },
  { Valor: '12 Angry Men', year: 1957 },
  { Valor: "Schindler's List", year: 1993 },
  { Valor: 'Pulp Fiction', year: 1994 },
  {
    Valor: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { Valor: 'The Good, the Bad and the Ugly', year: 1966 },
  { Valor: 'Fight Club', year: 1999 },
  {
    Valor: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    Valor: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { Valor: 'Forrest Gump', year: 1994 },
  { Valor: 'Inception', year: 2010 },
  {
    Valor: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { Valor: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { Valor: 'Goodfellas', year: 1990 },
  { Valor: 'The Matrix', year: 1999 },
  { Valor: 'Seven Samurai', year: 1954 },
  {
    Valor: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { Valor: 'City of God', year: 2002 },
  { Valor: 'Se7en', year: 1995 },
  { Valor: 'The Silence of the Lambs', year: 1991 },
  { Valor: "It's a Wonderful Life", year: 1946 },
  { Valor: 'Life Is Beautiful', year: 1997 },
  { Valor: 'The Usual Suspects', year: 1995 },
  { Valor: 'Léon: The Professional', year: 1994 },
  { Valor: 'Spirited Away', year: 2001 },
  { Valor: 'Saving Private Ryan', year: 1998 },
  { Valor: 'Once Upon a Time in the West', year: 1968 },
  { Valor: 'American History X', year: 1998 },
  { Valor: 'Interstellar', year: 2014 },
  { Valor: 'Casablanca', year: 1942 },
  { Valor: 'City Lights', year: 1931 },
  { Valor: 'Psycho', year: 1960 },
  { Valor: 'The Green Mile', year: 1999 },
  { Valor: 'The Intouchables', year: 2011 },
  { Valor: 'Modern Times', year: 1936 },
  { Valor: 'Raiders of the Lost Ark', year: 1981 },
  { Valor: 'Rear Window', year: 1954 },
  { Valor: 'The Pianist', year: 2002 },
  { Valor: 'The Departed', year: 2006 },
  { Valor: 'Terminator 2: Judgment Day', year: 1991 },
  { Valor: 'Back to the Future', year: 1985 },
  { Valor: 'Whiplash', year: 2014 },
  { Valor: 'Gladiator', year: 2000 },
  { Valor: 'Memento', year: 2000 },
  { Valor: 'The Prestige', year: 2006 },
  { Valor: 'The Lion King', year: 1994 },
  { Valor: 'Apocalypse Now', year: 1979 },
  { Valor: 'Alien', year: 1979 },
  { Valor: 'Sunset Boulevard', year: 1950 },
  {
    Valor: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { Valor: 'The Great Dictator', year: 1940 },
  { Valor: 'Cinema Paradiso', year: 1988 },
  { Valor: 'The Lives of Others', year: 2006 },
  { Valor: 'Grave of the Fireflies', year: 1988 },
  { Valor: 'Paths of Glory', year: 1957 },
  { Valor: 'Django Unchained', year: 2012 },
  { Valor: 'The Shining', year: 1980 },
  { Valor: 'WALL·E', year: 2008 },
  { Valor: 'American Beauty', year: 1999 },
  { Valor: 'The Dark Knight Rises', year: 2012 },
  { Valor: 'Princess Mononoke', year: 1997 },
  { Valor: 'Aliens', year: 1986 },
  { Valor: 'Oldboy', year: 2003 },
  { Valor: 'Once Upon a Time in America', year: 1984 },
  { Valor: 'Witness for the Prosecution', year: 1957 },
  { Valor: 'Das Boot', year: 1981 },
  { Valor: 'Citizen Kane', year: 1941 },
  { Valor: 'North by Northwest', year: 1959 },
  { Valor: 'Vertigo', year: 1958 },
  {
    Valor: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983,
  },
  { Valor: 'Reservoir Dogs', year: 1992 },
  { Valor: 'Braveheart', year: 1995 },
  { Valor: 'M', year: 1931 },
  { Valor: 'Requiem for a Dream', year: 2000 },
  { Valor: 'Amélie', year: 2001 },
  { Valor: 'A Clockwork Orange', year: 1971 },
  { Valor: 'Like Stars on Earth', year: 2007 },
  { Valor: 'Taxi Driver', year: 1976 },
  { Valor: 'Lawrence of Arabia', year: 1962 },
  { Valor: 'Double Indemnity', year: 1944 },
  {
    Valor: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
  },
  { Valor: 'Amadeus', year: 1984 },
  { Valor: 'To Kill a Mockingbird', year: 1962 },
  { Valor: 'Toy Story 3', year: 2010 },
  { Valor: 'Logan', year: 2017 },
  { Valor: 'Full Metal Jacket', year: 1987 },
  { Value: 'Dangal', year: 2016 },
  { Valor: 'The Sting', year: 1973 },
  { Valor: '2001: A Space Odyssey', year: 1968 },
  { Valor: "Singin' in the Rain", year: 1952 },
  { Valor: 'Toy Story', year: 1995 },
  { Valor: 'Bicycle Thieves', year: 1948 },
  { Valor: 'The Kid', year: 1921 },
  { Valor: 'Inglourious Basterds', year: 2009 },
  { Valor: 'Snatch', year: 2000 },
  { Valor: '3 Idiots', year: 2009 },
  { Valor: 'Monty Python and the Holy Grail', year: 1975 }
];