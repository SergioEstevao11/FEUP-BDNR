import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';

interface SearchProps {
  label : string,
}

export default function Search({label} : SearchProps) {
  const navigate = useNavigate();
  const [value, setValue] = React.useState<OptionType | null>(null);
  const [options, setOptions] = React.useState<OptionType[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = label == 'Royal' ? await fetch('http://127.0.0.1:5000/getRoyals') : await fetch('http://127.0.0.1:5000/getCountries');
      const data = await response.json();
      console.log(data)
      setOptions(data.result);
    };
    fetchData();
  }, []);

  const handleChange = (event : any, value : any) => {
    if(value)
      return label == 'Royal' ? navigate(`/royal/${value.id[0]}`) : navigate(`/conflict/${value.id[0]}`)
  } 


  return (
    <React.Fragment>
      <Autocomplete value={value} options={options} getOptionLabel={(option: OptionType) => option.name[0]} 
        renderOption={(props, option) => <li {...props} key={option.id[0]}>{option.name[0]}</li>}
        onChange={handleChange}
        selectOnFocus clearOnBlur handleHomeEndKeys sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label={label}  />}
      />
    </React.Fragment>
  );
}

interface OptionType {
  name: [string];
  id: [number];
}