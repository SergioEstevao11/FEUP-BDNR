import { useState } from 'react';
import MultiSelect from 'multiselect-react-dropdown';

const ConflictFilters = (): JSX.Element => {

  const [expandedYear, setExpandedYear] = useState<boolean>(false);
  const [yearValue, setYearValue] = useState(1458); // mudar para o min ano ou o ano a meio da range

  const [expandedCountry, setExpandedCountry] = useState<boolean>(false);
  const optionsCountry = [{name: 'Option 1', value: 'option1'}, {name: 'Option 2', value: 'option2'}, {name: 'Option 3', value: 'option3'}];
  const [selectedCountry, setSelectedCountry] = useState([]);

  const [expandedType, setExpandedType] = useState<boolean>(false);
  const optionsType= [{name: 'Option 1', value: 'option1'}, {name: 'Option 2', value: 'option2'}, {name: 'Option 3', value: 'option3'}];
  const [selectedType, setSelectedType] = useState([]);

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
    setSelectedCountry(selectedList);
  }
  const onRemoveType = (selectedList : []) => {
    setSelectedCountry(selectedList);
  }
  const handleToggleType = () => {
    setExpandedType(!expandedType);
  };

  
  const handleToggleYear = () => {
    setExpandedYear(!expandedYear);
  };
  


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
      <div id="conflict-year-body" className={`${expandedYear ? '' : 'hidden'}`} aria-labelledby="conflict-year">
          <span className="mr-2 text-gray-500 dark:text-white" id="ancestors-step">1458</span>
          <input id="ancestors-year" type="range" min="1458" max="1912" value={yearValue} className="w-60 px-3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(event) => setYearValue(Number(event.target.value))} />
          <span className="ml-2 text-gray-500 dark:text-white" id="ancestors-step">1912</span>
          <div className='text-janus font-bold'>{yearValue}</div>
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
    </div>
  );
};

export default ConflictFilters;