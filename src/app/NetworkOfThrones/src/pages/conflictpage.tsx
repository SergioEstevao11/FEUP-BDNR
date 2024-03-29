import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import royal from '../assets/war.jpg';

import ConflictFilters from '../components/conflictfilters'
import NodeView from '../components/nodeview'

export default function ConflictPage() {
    const { id } = useParams<{ id: string }>();
    const [active, setActive] = useState('table');
    const [name, setName] = useState('');
    const [religion, setReligion] = useState('-');
    const [fatalities, setFatalities] = useState('-');
    const [capital, setCapital] = useState('-');

    const [results, setConflictResults] = useState<any[]>([]);

    React.useEffect(() => {
      const fetchCountry = async () => {
        const response = await fetch(`http://localhost:5000/getCountry/${id}`);
        const data = await response.json();
        setName(data.name);
        setCapital(data.capital);
        setReligion(data.religion);
      };

      const fetchFatalities = async () => {
        const response = await fetch(`http://localhost:5000/getFatalities/${id}`);
        const data = await response.json();
        data.fatalities > 0 ? setFatalities(data.fatalities) : setFatalities('-');
      };

      fetchCountry();
      fetchFatalities();
    }, []);

    const applyFilters = async (filters : string) => {
      const response = await fetch(`http://localhost:5000/getFilteredCountries/${id}/${filters}/`);
      const data = await response.json();

      setConflictResults(data);
    };

    return (
      <main className=' w-full bg-white justify-center m-0'>
        <div className="flex w-96 items-center justify-start ">
          <a href="/" className="font-bold text-2xl sm:text-2xl mt-10">A Network Of Thrones</a>
          <a href="/" className="font-bold  sm:text-xl mt-10 text-janus px-3">Conflicts</a>
        </div>
        <div id="royal-info" className='flex w-full m-12'>
          <img className='w-64 h-64 rounded-full object-cover my-5 mr-10' src={royal} alt="royal" />
          <div className='flex flex-col'>
            <h1 id="royal-name" className="text-start text-janus font-bold my-12 "> {name} </h1>
            <div >
              <div className='flex items-center'>
                <div id="royal-dinasty" className='flex mr-20'>
                  <h2 className="text-start  text-xl font-bold"> Capital: </h2>
                  <span className=" text-start  text-xl px-3 self-center"> {capital} </span>
                </div>
                <div id="royal-ruling period" className='flex mr-20'>
                  <h2 className="text-start  text-xl font-bold px-3"> Total Fatalities: </h2>
                  <span className=" text-start  text-xl self-center"> {fatalities} </span>
                </div>
              </div>
              <div id="royal-country" className='flex mt-3'>
                  <h2 className="text-start  text-xl font-bold"> Religion: </h2>
                  <span className=" text-start  text-xl px-3 self-center"> {religion} </span>
              </div>
            </div>
          </div>
        </div>

        <div id="royal-filter-view" className='mb-10'>
          <div className="grid grid-cols-3 gap-4">
            <div id="royal-filter"className="col-span-1 mt-10">
              <ConflictFilters id={id} callback={applyFilters} reset={() => setConflictResults([])}/>
            </div>
            <div id="royal-view" className="col-span-2">
              <div id="tabs-view" className="border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                  <li className="mr-2" >
                    <a href="#" className={`inline-flex p-4 border-b-2 rounded-t-lg ${ active === 'table' ? 'border-janus text-janus' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group'}`} onClick={() => setActive('table')} aria-current="page" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" fill="currentColor" className="bi bi-table" viewBox="0 0 16 16"> <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/> </svg> 
                    </a>
                  </li>
                  <li className="mr-2" >
                    <a href="#" className={`inline-flex p-4 border-b-2 rounded-t-lg ${ active === 'graph' ? 'border-janus text-janus' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group'}`} onClick={() => setActive('graph')} aria-current="page" >
                      <svg  width="30" height="25" fill="black" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13.5 7L17 10.5" stroke="#000000" strokeLinecap="round"></path> <path d="M7 13.5L10.5 17" stroke="#000000" strokeLinecap="round"></path> <path d="M10.5 7L7 10.5" stroke="#000000" strokeLinecap="round"></path> <path d="M17 13.5L13.5 17" stroke="#000000" strokeLinecap="round"></path> <circle cx="12" cy="5.5" r="2" stroke="#000000"></circle> <circle cx="12" cy="18.5" r="2" stroke="#000000"></circle> <circle cx="5.5" cy="12" r="2" stroke="#000000"></circle> <circle cx="18.5" cy="12" r="2" stroke="#000000"></circle> </g></svg>
                    </a>
                  </li>
                </ul>
              </div>
              {active === 'table' ?
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-white uppercase bg-janus">
                      <tr>
                        <th scope="col-6" className="px-6 py-3 text-left">
                            Country
                        </th>
                        <th scope="col-2" className="px-6 py-3 text-center">
                            War Name
                        </th>
                        <th scope="col-2" className="px-6 py-3 text-center">
                            Year
                        </th>
                        <th scope="col-2" className="px-6 py-3 text-center">
                            Type
                        </th>
                      </tr>
                  </thead>
                  <tbody>
                  {results.map((conflict) => (
                    <tr
                      key={`${conflict.index}`}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {conflict.country}
                      </th>
                      <td className="px-6 py-4 text-center">{conflict.name}</td>
                      <td className="px-6 py-4 text-center">{conflict.year == '' ? '-' :  parseInt(conflict.year)}</td>
                      <td className="px-6 py-4 text-center">{conflict.type}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
                : <NodeView></NodeView>}
            </div>
          </div>
        </div>
      </main>
      ); 
}