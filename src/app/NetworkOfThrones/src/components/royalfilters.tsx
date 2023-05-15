import React, { useState } from 'react';
import MultiSelect from 'multiselect-react-dropdown';
import RangeSlider from './range';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';


const SimpleSlider = styled(Slider)({
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

interface RoyalProps {
  id: string | undefined;
  birthYear: number;
  deathYear: number;
  callback : (value: string) => void;
}


const RoyalFilters = ({id, birthYear, deathYear, callback} : RoyalProps): JSX.Element => {

  const [blockAncestorYear, setBlockAncestorYear] = useState<boolean>(false);
  const [blockDescendantYear, setBlockDescendantYear] = useState<boolean>(false);

  const [expandedAncestors, setExpandedAncestors] = useState<boolean>(false);
  const [activeAncestors, setActiveAncestors] = useState('generation');
  const [genAncestorsValue, setGenAncestorsValue] = useState<number>(1);
  const [yearAncestorsValue, setYearAncestorsValue] = useState([1000, 2003]); // mudar para o min ano ou o ano a meio da range

  const [expandedDescendants, setExpandedDescendants] = useState<boolean>(false);
  const [activeDescendants, setActiveDescendants] = useState('generation');
  const [genDescendantsValue, setGenDescendantsValue] = useState(1);
  const [yearDescendantsValue, setYearDescendantsValue] = useState([1000,2003]); // mudar para o min ano ou o ano a meio da range

  const [expandedContemporaries, setExpandedContemporaries] = useState<boolean>(false);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [siblings, setSiblings] = useState<boolean>(false);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://127.0.0.1:5000/getContemporaries/${id}`);
      const data = await response.json();

      setOptions(data);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if(!isNaN(birthYear))
      setYearAncestorsValue([birthYear - 100, birthYear])
    else setBlockAncestorYear(true);

    if(!isNaN(deathYear))
      setYearDescendantsValue([deathYear, deathYear + 100])
    else setBlockDescendantYear(true);

  }, [birthYear, deathYear])

  const onSelect = (selectedList : []) => {
    setSelectedOptions(selectedList);
  }

  const onRemove = (selectedList : []) => {
    setSelectedOptions(selectedList);
  }

  const handleToggleAncestors = () => {
    setExpandedAncestors(!expandedAncestors);
  };

  const handleToggleDescendants = () => {
    setExpandedDescendants(!expandedDescendants);
  };

  const handleToggleContemporaries = () => {
    setExpandedContemporaries(!expandedContemporaries);
  };


  const handleFilters = () => {
    const filters = {
      ancestors : expandedAncestors ? {
        [activeAncestors] : activeAncestors == 'generation' ? genAncestorsValue : yearAncestorsValue
      } : {},
      descendants : expandedDescendants ? {
        [activeDescendants] : activeDescendants == 'generation' ? genDescendantsValue : yearDescendantsValue
      } : {},
      contemporaries : expandedContemporaries ? selectedOptions : [],
      siblings : siblings,
    };

    callback(JSON.stringify(filters))
  }

  return (
    <div data-accordion="collapse" data-active-classnamees="bg-white dark:bg-gray-900 text-gray-900 dark:text-white" data-inactive-classnamees="text-gray-500 dark:text-gray-400">
      <h2 id="royal-ancestors">
        <button type="button" className="flex items-center justify-between w-full font-medium text-left text-gray-500  dark:border-gray-700 dark:text-gray-400" data-accordion-target="#royal-ancestors-body"
          aria-expanded={expandedAncestors} aria-controls="royal-ancestors-body" onClick={handleToggleAncestors}>
          <span>Ancestors</span>
          <svg data-accordion-icon className={`w-6 h-6 ${expandedAncestors ? 'rotate-180' : ''} shrink-0`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
      </h2>
      <div id="royal-ancestors-body" className={`${expandedAncestors ? '' : 'hidden'}`} aria-labelledby="royal-ancestors">
        <button type="button" className={`text-white bg-janus hover:bg-janus focus:outline-none font-medium rounded-full text-sm px-5 py-1 text-center mr-2 mb-2 ${activeAncestors == 'generation' ? '' : 'opacity-50'}`}  onClick={() => setActiveAncestors('generation')} >By Generation</button>
        {blockAncestorYear? <></> : <button type="button" className={`text-white bg-janus hover:bg-janus focus:outline-none font-medium rounded-full text-sm px-5 py-1 text-center mr-2 mb-2 ${activeAncestors == 'year' ? '' : 'opacity-50'}`}  onClick={() => setActiveAncestors('year')} >By Year</button> }
        <div className={`${activeAncestors == 'generation' ? '' : 'hidden'} my-2 mx-10`}>
          <SimpleSlider defaultValue={1} step={1} marks={[{label:1, value:1},{label:2, value:2},{label:3,value:3}]} min={1} max={3} value={genAncestorsValue} onChange={ (e, val) => setGenAncestorsValue(Array.isArray(val) ? val[0] : val) }  />
        </div>
        {blockAncestorYear? <></> : 
          <div className={`${activeAncestors == 'year' ? '' : 'hidden'} my-2 mx-10`}>
            <RangeSlider year={[1000,isNaN(birthYear) ? 1400 : birthYear]} minDistance={5} value={yearAncestorsValue} setValue={setYearAncestorsValue}></RangeSlider>
          </div>
        }
      </div>
      <h2 id="royal-descendants">
        <button type="button" className="flex items-center justify-between w-full font-medium text-left text-gray-500  dark:border-gray-700 dark:text-gray-400" data-accordion-target="#royal-ancestors-body"
          aria-expanded={expandedDescendants} aria-controls="royal-descendants-body" onClick={handleToggleDescendants}>
          <span>Descendants</span>
          <svg data-accordion-icon className={`w-6 h-6 ${expandedDescendants ? 'rotate-180' : ''} shrink-0`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
      </h2>
      <div id="royal-descendants-body" className={`${expandedDescendants ? '' : 'hidden'}`} aria-labelledby="royal-descendants">
        <button type="button" className={`text-white bg-janus hover:bg-janus focus:outline-none font-medium rounded-full text-sm px-5 py-1 text-center mr-2 mb-2 ${activeDescendants == 'generation' ? '' : 'opacity-50'}`}  onClick={() => setActiveDescendants('generation')} >By Generation</button>
        {blockDescendantYear? <></> : <button type="button" className={`text-white bg-janus hover:bg-janus focus:outline-none font-medium rounded-full text-sm px-5 py-1 text-center mr-2 mb-2 ${activeDescendants == 'year' ? '' : 'opacity-50'}`}  onClick={() => setActiveDescendants('year')} >By Year</button>}
        <div className={`${activeDescendants == 'generation' ? '' : 'hidden'} my-2 mx-10`}>
          <SimpleSlider defaultValue={1} step={1} value={genDescendantsValue} marks={[{label:1, value:1},{label:2, value:2},{label:3,value:3}]} min={1} max={3} onChange={ (e, val) => setGenDescendantsValue(Array.isArray(val) ? val[0] : val) }  />
        </div>
        {blockDescendantYear? <></> : 
          <div className={`${activeDescendants == 'year' ? '' : 'hidden'} my-2 mx-10`}>
            <RangeSlider year={[isNaN(deathYear) ? 1500 : deathYear, 2003]} minDistance={5} value={yearDescendantsValue} setValue={setYearDescendantsValue}></RangeSlider>
          </div>
        }
      </div>
      {(blockAncestorYear || blockDescendantYear)? <></> : 
        <h2 id="royal-contemporaries">
          <button type="button" className="flex items-center justify-between w-full font-medium text-left text-gray-500  dark:border-gray-700 dark:text-gray-400" data-accordion-target="#royal-ancestors-body"
            aria-expanded={expandedDescendants} aria-controls="royal-contemporaries-body" onClick={handleToggleContemporaries}>
            <span>Contemporaries</span>
            <svg data-accordion-icon className={`w-6 h-6 ${expandedContemporaries ? 'rotate-180' : ''} shrink-0`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </h2>
      }
      <div id="royal-contemporaries-body" className={`${expandedContemporaries ? '' : 'hidden'}`} aria-labelledby="royal-ancestors">
          <MultiSelect options={options} selectedValues={selectedOptions} onSelect={onSelect} onRemove={onRemove} displayValue="name" showCheckbox={true} 
              className='w-full px-5 accent-janus'/>
      </div>

      <div className="flex items-center px-5 py-3">
        <input id="siblings-checkbox" type="checkbox" value="" className="w-4 h-4 text-janus  accent-janus bg-gray-100 border-gray-300 rounded focus:ring-janus dark:focus:ring-janus dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" checked={siblings} onChange={(event) => setSiblings(event.target.checked)} />
        <label htmlFor="siblings-checkbox" className="ml-2 font-medium text-gray-500 dark:text-gray-300">Siblings</label>
      </div>

    <div className='m-10'>
      <Button variant="contained" className='w-full' style={{ backgroundColor: '#108768', color: 'white'}} onClick={handleFilters}>Filter</Button>
    </div>
    </div>
  );
};

export default RoyalFilters;