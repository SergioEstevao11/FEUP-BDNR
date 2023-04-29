import { useState } from 'react';
import MultiSelect from 'multiselect-react-dropdown';

const RoyalFilters = (): JSX.Element => {

  const [expandedAncestors, setExpandedAncestors] = useState<boolean>(false);
  const [activeAncestors, setActiveAncestors] = useState('generation');
  const [genAncestorsValue, setGenAncestorsValue] = useState(1);
  const [yearAncestorsValue, setYearAncestorsValue] = useState(1458); // mudar para o min ano ou o ano a meio da range

  const [expandedDescendants, setExpandedDescendants] = useState<boolean>(false);
  const [activeDescendants, setActiveDescendants] = useState('generation');
  const [genDescendantsValue, setGenDescendantsValue] = useState(1);
  const [yearDescendantsValue, setYearDescendantsValue] = useState(1458); // mudar para o min ano ou o ano a meio da range

  const [expandedContemporaries, setExpandedContemporaries] = useState<boolean>(false);
  const options = [{name: 'Option 1', value: 'option1'}, {name: 'Option 2', value: 'option2'}, {name: 'Option 3', value: 'option3'}];
  const [selectedOptions, setSelectedOptions] = useState([]);

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
        <button type="button" className={`text-white bg-janus hover:bg-janus focus:outline-none font-medium rounded-full text-sm px-5 py-1 text-center mr-2 mb-2 ${activeAncestors == 'year' ? '' : 'opacity-50'}`}  onClick={() => setActiveAncestors('year')} >By Year</button>
        <div className={`${activeAncestors == 'generation' ? '' : 'hidden'}`}>
          <input id="ancestors-step" type="range" min="1" max="3" value={genAncestorsValue} step="1" className="w-60 px-3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(event) => setGenAncestorsValue(Number(event.target.value))}/>
          <span className="ml-2 text-janus font-bold dark:text-white" id="ancestors-step">{genAncestorsValue}</span>
        </div>
        <div className={`${activeAncestors == 'year' ? '' : 'hidden'}`}>
          <span className="mr-2 text-gray-500 dark:text-white" id="ancestors-step">1458</span>
          <input id="ancestors-year" type="range" min="1458" max="1912" value={yearAncestorsValue} className="w-60 px-3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(event) => setYearAncestorsValue(Number(event.target.value))} />
          <span className="ml-2 text-gray-500 dark:text-white" id="ancestors-step">1912</span>
          <div className='text-janus font-bold'>{yearAncestorsValue}</div>
        </div>
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
      <div id="royal-descendants-body" className={`${expandedDescendants ? '' : 'hidden'}`} aria-labelledby="royal-ancestors">
        <button type="button" className={`text-white bg-janus hover:bg-janus focus:outline-none font-medium rounded-full text-sm px-5 py-1 text-center mr-2 mb-2 ${activeDescendants == 'generation' ? '' : 'opacity-50'}`}  onClick={() => setActiveDescendants('generation')} >By Generation</button>
        <button type="button" className={`text-white bg-janus hover:bg-janus focus:outline-none font-medium rounded-full text-sm px-5 py-1 text-center mr-2 mb-2 ${activeDescendants == 'year' ? '' : 'opacity-50'}`}  onClick={() => setActiveDescendants('year')} >By Year</button>
        <div className={`${activeDescendants == 'generation' ? '' : 'hidden'}`}>
          <input id="ancestors-step" type="range" min="1" max="3" value={genDescendantsValue} step="1" className="w-60 px-3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(event) => setGenDescendantsValue(Number(event.target.value))}/>
          <span className="ml-2 text-janus font-bold dark:text-white" id="ancestors-step">{genDescendantsValue}</span>
        </div>
        <div className={`${activeDescendants == 'year' ? '' : 'hidden'}`}>
          <span className="mr-2 text-gray-500 dark:text-white" id="ancestors-step">1458</span>
          <input id="ancestors-year" type="range" min="1458" max="1912" value={yearDescendantsValue} className="w-60 px-3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(event) => setYearDescendantsValue(Number(event.target.value))} />
          <span className="ml-2 text-gray-500 dark:text-white" id="ancestors-step">1912</span>
          <div className='text-janus font-bold'>{yearDescendantsValue}</div>
        </div>
      </div>
      <h2 id="royal-contemporaries">
        <button type="button" className="flex items-center justify-between w-full font-medium text-left text-gray-500  dark:border-gray-700 dark:text-gray-400" data-accordion-target="#royal-ancestors-body"
          aria-expanded={expandedDescendants} aria-controls="royal-contemporaries-body" onClick={handleToggleContemporaries}>
          <span>Contemporaries</span>
          <svg data-accordion-icon className={`w-6 h-6 ${expandedContemporaries ? 'rotate-180' : ''} shrink-0`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
      </h2>
      <div id="royal-contemporaries-body" className={`${expandedContemporaries ? '' : 'hidden'}`} aria-labelledby="royal-ancestors">
          <MultiSelect options={options} selectedValues={selectedOptions} onSelect={onSelect} onRemove={onRemove} displayValue="name" showCheckbox={true} 
              className='w-full px-5 accent-janus'/>
      </div>

      <div className="flex items-center px-5 py-3">
        <input id="siblings-checkbox" type="checkbox" value="" className="w-4 h-4 text-janus  accent-janus bg-gray-100 border-gray-300 rounded focus:ring-janus dark:focus:ring-janus dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
        <label htmlFor="siblings-checkbox" className="ml-2 font-medium text-gray-500 dark:text-gray-300">Siblings</label>
      </div>
      <div className="flex items-center px-5 py-3">
        <input id="dinasty-checkbox" type="checkbox" value="" className="w-4 h-4 text-janus  accent-janus bg-gray-100 border-gray-300 rounded focus:ring-janus dark:focus:ring-janus dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
        <label htmlFor="dinasty-checkbox" className="ml-2 font-medium text-gray-500 dark:text-gray-300">Shared Dinasty</label>
      </div>
    </div>
  );
};

export default RoyalFilters;