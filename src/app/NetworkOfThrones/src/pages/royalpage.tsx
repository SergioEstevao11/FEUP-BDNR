import { useParams } from 'react-router-dom';
import royal from '../assets/royal.jpg';

export default function RoyalPage() {
    const { id } = useParams<{ id: string }>();

    return (
      <main className=' w-full bg-white justify-center m-0'>
        <div className="flex w-96 items-center justify-start ">
          <a href="/" className="font-bold text-2xl sm:text-2xl mt-10">A Network Of Thrones</a>
          <a href="/" className="font-bold  sm:text-xl mt-10 text-janus px-3">Royals</a>
        </div>
        <div id="royal-info" className='flex  w-full m-12'>
          <img className='w-64 h-64 rounded-full object-cover my-5 mr-10' src={royal} alt="royal" />
          <div className='flex flex-col justify-around'>
            <div>
              <h1 id="royal-name" className="text-start text-janus font-bold"> Rainha Vitória </h1>
              <h2 id="royal-title" className="text-start text-2xl mb-3"> Queen of England </h2>
              <div className='flex justify-start mb-3'>
                  <h1 className="text-start  text-4xl font-bold"> 1819 </h1>
                  <h1 className="text-start  text-4xl font-bold px-2">  - </h1>
                  <h1 className="text-start  text-4xl font-bold"> 1901 </h1>
              </div>
            </div>
            <div>
              <div className='flex justify-around items-center'>
                <div id="royal-dinasty" className='flex mr-20'>
                  <h2 className="text-start  text-2xl font-bold"> Dinasty </h2>
                  <span className=" text-start  text-xl px-3 self-center"> Hanover </span>
                </div>
                <div id="royal-ruling period" className='flex'>
                  <h2 className="text-start  text-2xl font-bold px-3"> Ruling Period </h2>
                  <span className=" text-start  text-xl self-center"> 1837 </span>
                  <span className=" text-start  text-xl px-3"> - </span>
                  <span className=" text-start  text-xl self-center"> 1901 </span>
                </div>
              </div>
              <div id="royal-country" className='flex mt-3'>
                  <h2 className="text-start  text-2xl font-bold"> Country </h2>
                  <span className=" text-start  text-xl px-3 self-center"> England </span>
              </div>
            </div>
          </div>
        </div>

        <div id="royal-filter-view">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
            </div>
            <div id="royal-view" className="col-span-2">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                <li className="mr-2">
                  <a href="#" className="inline-flex p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-table" viewBox="0 0 16 16"> <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/> </svg> 
                  </a>
                </li>
                <li className="mr-2">
                  <a href="#" className="inline-flex p-4 text-janus border-b-2 border-janus rounded-t-lg active dark:text-janus dark:border-janus group" aria-current="page">
                    <svg  width="30" height="25" fill="black" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13.5 7L17 10.5" stroke="#000000" stroke-linecap="round"></path> <path d="M7 13.5L10.5 17" stroke="#000000" stroke-linecap="round"></path> <path d="M10.5 7L7 10.5" stroke="#000000" stroke-linecap="round"></path> <path d="M17 13.5L13.5 17" stroke="#000000" stroke-linecap="round"></path> <circle cx="12" cy="5.5" r="2" stroke="#000000"></circle> <circle cx="12" cy="18.5" r="2" stroke="#000000"></circle> <circle cx="5.5" cy="12" r="2" stroke="#000000"></circle> <circle cx="18.5" cy="12" r="2" stroke="#000000"></circle> </g></svg>
                  </a>
                </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      ); 
}