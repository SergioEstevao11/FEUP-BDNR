import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const JanusSlider = styled(Slider)({
  color: '#108768', 
  '& .MuiSlider-thumb': {
    backgroundColor: '#108768', 
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.29)',
    '&:hover': {
      boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.29)',
    },
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: 'transparent',
    color: 'inherit',
    top: 'calc(100% + 36px)',
    '& > span': {
      fontSize: 16,
      fontWeight: 'bold',
    },
  },
});

interface RangeSliderProps {
    year: [number, number];
    minDistance: number;
    value: number[];
    setValue : (value : [number, number]) => void;
}

export default function RangeSlider({ year, minDistance, value, setValue}: RangeSliderProps) {

  const handleChange = ( event: Event, newValue: number | number[], activeThumb: number ) => {

    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
    } else {
      setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
    }
  };

  return (
    <JanusSlider getAriaLabel={() => 'Minimum distance'} max={year[1]}  valueLabelDisplay="on" min={year[0]} value={value} onChange={handleChange} disableSwap/>
  );
}