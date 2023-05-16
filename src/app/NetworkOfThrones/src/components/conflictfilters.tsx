import React, { useState } from 'react';
import MultiSelect from 'multiselect-react-dropdown';
import RangeSlider from './range';
import Button from '@mui/material/Button';

interface ConflictProps {
  id: string | undefined;
  callback : (value: string) => void;
  reset : () => void;
}

const ConflictFilters = ({callback, reset} : ConflictProps): JSX.Element => {

  const [expandedYear, setExpandedYear] = useState<boolean>(false);
  const [yearValue, setYearValue] = useState([1100,1903]); // mudar para o min ano ou o ano a meio da range

  const [expandedCountry, setExpandedCountry] = useState<boolean>(false);
  const [optionsCountry, setOptionsCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);

  const [expandedType, setExpandedType] = useState<boolean>(false);
  const [optionsType, setOptionsType] = useState([]);
  const [selectedType, setSelectedType] = useState([]);

  const resetFilters = () => {
    setExpandedYear(false)
    setYearValue([1100,1903])

    setExpandedCountry(false)
    setSelectedCountry([])

    setExpandedType(false)
    setSelectedType([])

    reset();
  }


  React.useEffect(() => {
    const fetchCountryOptions = async () => {
      const response = await fetch(`http://localhost:5000/getCountries`);
      const data = await response.json();

      setOptionsCountry(data.result);
    };

    const fetchConflictType = async () => {
      const response = await fetch(`http://localhost:5000/getConflictTypes`);
      const data = await response.json();

      setOptionsType(data);
    };

    fetchCountryOptions();
    fetchConflictType();
  }, []);

  const onSelectCountry = (selectedList : []) => {
    setSelectedCountry(selectedList);
  }
  const onRemoveCountry = (selectedList : []) => {
    setSelectedCountry(selectedList);
  }
  const handleToggleCountry = () => {
    setExpandedCountry(!expandedCountry);
  };

  const onSelectType = (selectedList : []) => {
    setSelectedType(selectedList);
  }
  const onRemoveType = (selectedList : []) => {
    setSelectedType(selectedList);
  }
  const handleToggleType = () => {
    setExpandedType(!expandedType);
  };

  
  const handleToggleYear = () => {
    setExpandedYear(!expandedYear);
  };

  const handleFilters = () => {
    const filters = {
      country : expandedCountry ?  selectedCountry : [],
      type : expandedType ? selectedType : [],
      year: expandedYear ? yearValue : []
    };

    callback(JSON.stringify(filters))
  }
  


  return (
    <div data-accordion="collapse" data-active-classnamees="bg-white dark:bg-gray-900 text-gray-900 dark:text-white" data-inactive-classnamees="text-gray-500 dark:text-gray-400">
      <h2 id="conflict-year">
        <button type="button" className="flex items-center justify-between w-full font-medium text-left text-gray-500  dark:border-gray-700 dark:text-gray-400" data-accordion-target="#conflict-year-body"
          aria-expanded={expandedYear} aria-controls="conflict-year-body" onClick={handleToggleYear}>
          <span>Year</span>
          <svg data-accordion-icon className={`w-6 h-6 ${expandedYear ? 'rotate-180' : ''} shrink-0`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
      </h2>
      <div id="conflict-year-body" className={`${expandedYear ? '' : 'hidden'} my-2 mx-10`} aria-labelledby="conflict-year">
        <RangeSlider year={[1000,2003]} minDistance={50} value={yearValue} setValue={setYearValue}></RangeSlider>
      </div>
      <h2 id="conflict-country">
        <button type="button" className="flex items-center justify-between w-full font-medium text-left text-gray-500  dark:border-gray-700 dark:text-gray-400" data-accordion-target="#rconflict-country-body"
          aria-expanded={expandedCountry} aria-controls="conflict-country-body" onClick={handleToggleCountry}>
          <span>Country</span>
          <svg data-accordion-icon className={`w-6 h-6 ${expandedCountry ? 'rotate-180' : ''} shrink-0`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
      </h2>
      <div id="conflict-country-body" className={`${expandedCountry ? '' : 'hidden'}`} aria-labelledby="conflict-type">
      <MultiSelect options={optionsCountry} selectedValues={selectedCountry} onSelect={onSelectCountry} onRemove={onRemoveCountry} displayValue="name" showCheckbox={true} 
              className='w-full px-5 accent-janus'/>
      </div>
      <h2 id="conflict-type">
        <button type="button" className="flex items-center justify-between w-full font-medium text-left text-gray-500  dark:border-gray-700 dark:text-gray-400" data-accordion-target="#conflict-type-body"
          aria-expanded={expandedType} aria-controls="conflict-type-body" onClick={handleToggleType}>
          <span>Type</span>
          <svg data-accordion-icon className={`w-6 h-6 ${expandedType ? 'rotate-180' : ''} shrink-0`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
      </h2>
      <div id="conflict-type-body" className={`${expandedType ? '' : 'hidden'}`} aria-labelledby="conflict-type">
      <MultiSelect options={optionsType} selectedValues={selectedType} onSelect={onSelectType} onRemove={onRemoveType} displayValue="name" showCheckbox={true} 
              className='w-full px-5 accent-janus'/>
      </div>
      <div className='m-10'>
        <Button variant="contained" className='w-full' style={{ backgroundColor: '#108768', color: 'white'}} onClick={handleFilters}>Filter</Button>
        <Button variant="outlined" className='w-full' style={{ borderColor: '#108768', backgroundColor: 'white', color: '#108768', marginTop: '10px'}} onClick={resetFilters}>Reset</Button>
      </div>
    </div>
  );
};

export default ConflictFilters;