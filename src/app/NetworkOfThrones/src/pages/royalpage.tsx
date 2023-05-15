import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import royal from '../assets/royal.jpg';
import Button from '@mui/material/Button';

import RoyalFilters from '../components/royalfilters'
import NodeView from '../components/nodeview'

export default function RoyalPage() {
    const { id } = useParams<{ id: string }>();
    const [active, setActive] = useState('table');

    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [deathYear, setDeathYear] = useState('');

    const [family, setFamily] = useState('-');
    const [startRuling, setStartRuling] = useState('');
    const [endRuling, setEndRuling] = useState('');
    const [country, setCountry] = useState('-');

    React.useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(`http://127.0.0.1:5000/getRoyal/${id}`);
        const data = await response.json();

        setName(data.name[0]);
        setTitle(isNaN(data.title[0]) ? '' : data.title[0]);
        setBirthYear(data.year_birth[0] == 'nan' ? '' : data.year_birth[0]);
        setDeathYear(data.year_death[0]  == 'nan' ? '' : data.year_birth[0]);

      };
      fetchData();
    }, []);

    const applyFilters = () => {};

    return (
      <main className=' w-full bg-white justify-center m-0'>
        <div className="flex w-96 items-center justify-start ">
          <a href="/" className="font-bold text-2xl sm:text-2xl mt-10"> A Network Of Thrones</a>
          <a href="/" className="font-bold  sm:text-xl mt-10 text-janus px-3">Royals</a>
        </div>
        <div id="royal-info" className='flex w-full m-12'>
          <img className='w-64 h-64 rounded-full object-cover my-5 mr-10' src={royal} alt="royal" />
          <div className='flex flex-col justify-around'>
            <div>
              <h1 id="royal-name" className="text-start text-janus font-bold"> {name} </h1>
              <h2 id="royal-title" className="text-start text-2xl mb-3"> {title} </h2>
              <div className='flex justify-start mb-3'>
                  <h1 className="text-start  text-3xl font-bold"> {birthYear} </h1>
                  <h1 className="text-start  text-3xl font-bold px-2">  - </h1>
                  <h1 className="text-start  text-3xl font-bold"> {deathYear} </h1>
              </div>
            </div>
            <div>
              <div className='flex items-center'>
                <div id="royal-family" className='flex mr-20'>
                  <h2 className="text-start  text-xl font-bold"> Family: </h2>
                  <span className=" text-start  text-xl px-3 self-center"> {family} </span>
                </div>
                <div id="royal-ruling period" className='flex'>
                  <h2 className="text-start  text-xl font-bold px-3"> Ruling Period: </h2>
                  <span className=" text-start  text-xl self-center"> {startRuling} </span>
                  <span className=" text-start  text-xl px-3"> - </span>
                  <span className=" text-start  text-xl self-center"> {endRuling} </span>
                </div>
              </div>
              <div id="royal-country" className='flex mt-3'>
                  <h2 className="text-start  text-xl font-bold"> Country: </h2>
                  <span className=" text-start  text-xl px-3 self-center"> {country} </span>
              </div>
            </div>
          </div>
        </div>

        <div id="royal-filter-view" className='mb-10'>
          <div className="grid grid-cols-3 gap-4">
            <div id="royal-filter"className="col-span-1 mt-10">
              <RoyalFilters id={id} birthYear={parseInt(birthYear)} deathYear={parseInt(deathYear)}/>
              <div className='m-10'>
                <Button variant="contained" className='w-full' style={{ backgroundColor: '#108768', color: 'white'}} onClick={applyFilters}>Filter</Button>
              </div>
            </div>
            <div id="royal-view" className="col-span-2">
              <div id="tabs-view" className="border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                  <li className="mr-2" >
                    <a href="#table-view" className={`inline-flex p-4 border-b-2 rounded-t-lg ${ active === 'table' ? 'border-janus text-janus' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group'}`} onClick={() => setActive('table')} aria-current="page" >
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
                            Name
                        </th>
                        <th scope="col-2" className="px-6 py-3 text-center">
                            Birth Year
                        </th>
                        <th scope="col-2" className="px-6 py-3 text-center">
                            Death Year
                        </th>
                        <th scope="col-2" className="px-6 py-3 text-center">
                            Kinship
                        </th>
                      </tr>
                  </thead>
                  <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          Maria José
                      </th>
                      <td className="px-6 py-4 text-center">
                          2001
                      </td>
                      <td className="px-6 py-4 text-center">
                          nunca sou imortal
                      </td>
                      <td className="px-6 py-4 text-center">
                          Rainha do Mundo
                      </td>
                  </tr>
                  </tbody>
                </table>
               : <NodeView></NodeView>
               }
            </div>
          </div>
        </div>
      </main>
      ); 
}