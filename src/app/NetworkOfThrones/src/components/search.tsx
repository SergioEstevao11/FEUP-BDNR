import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { SyntheticEvent } from 'react';

const filter = createFilterOptions<FilmOptionType>();

interface SearchProps {
  label : string,
}

export default function Search({label} : SearchProps) {
  const [value, setValue] = React.useState<FilmOptionType | null>(null);
  const [open, toggleOpen] = React.useState(false);

  const searchStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ccc',
      },
      '&:hover fieldset': {
        borderColor: '#888',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'blue',
      },
    },
  };

  const handleClose = () => {
    setDialogValue({
      title: '',
      year: '',
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    title: '',
    year: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValue({
      title: dialogValue.title,
      year: parseInt(dialogValue.year, 10),
    });
    handleClose();
  };

  const handleOnChange = (event: SyntheticEvent<Element, Event>, newValue : string | FilmOptionType | null) => {
    if (typeof newValue === 'string') { 
      setTimeout(() => { 
        toggleOpen(true);
        setDialogValue({ title: newValue, year: '',})
      ;});
      } else if (newValue && newValue.inputValue) { 
        toggleOpen(true); setDialogValue({
              title: newValue.inputValue,
              year: '',
        });
    } else 
            setValue(newValue);
    };

  const getFilterOptions = (options : any, params : any) => {
    const filtered = filter(options, params);
    if (params.inputValue !== '') {
      filtered.push({
        inputValue: params.inputValue,
        title: `Add "${params.inputValue}"`,
      });
    }
    return filtered;
  }

  const getOptionLabel = (option : any) => {
    if (typeof option === 'string') {
      return option;
    }
    if (option.inputValue) {
      return option.inputValue;
    }
    return option.title;
  }

  return (
    <React.Fragment>
      <Autocomplete value={value} onChange={handleOnChange} filterOptions={getFilterOptions} options={entities} getOptionLabel={getOptionLabel}
        selectOnFocus clearOnBlur handleHomeEndKeys renderOption={(props, option) => <li {...props}>{option.title}</li>} sx={{ width: 300 }} freeSolo
        renderInput={(params) => <TextField {...params} label={label}  />}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add a new film</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you miss any film in our list? Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.title}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  title: event.target.value,
                })
              }
              label="title"
              type="text"
              variant="standard"
            />
            <TextField
              margin="dense"
              id="name"
              value={dialogValue.year}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  year: event.target.value,
                })
              }
              label="year"
              type="number"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

interface FilmOptionType {
  inputValue?: string;
  title: string;
  year?: number;
}

// Mudar para a query
const entities: readonly FilmOptionType[] = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];