

import royal from '../assets/royal.jpg';
import conflict from '../assets/war.jpg';

import Search from '../components/search';

export default function HomePage() {

    return (
      <main className='bg-white p-0 sm:mb-20 m-auto'>
        <div className='flex flex-col p-0 sm:m-auto justify-center items-center'>
          <a href='/' className='flex justify-center items-center select-none text-3xl mt-5'>
            <h1> A </h1>
            <h1 className="text-janus font-bold"> Network </h1>
            <h1> Of Thrones</h1>
          </a>
          <h3 className="text-2xl my-2">A JanusGraph prototype to analyze kinship and conflicts in Europe</h3>

          <div className="flex w-full justify-around items-center my-5">
            <div id="search-royals" className="flex flex-col justify-center items-center">
                <h2 className="text-janus text-5xl font-bold m-5"> Royals </h2>
                <img className='w-64 h-64 rounded-full object-cover my-5' src={royal} alt="royal" />
                <Search label={"Royal"}/>
            </div> 
            <div id="search-countries" className="flex flex-col justify-center items-center">
                <h2 className="text-janus text-5xl font-bold m-5"> Conflicts </h2>
                <img className='w-64 h-64 rounded-full object-cover my-5' src={conflict} alt="conflict" />
                <Search label={"Conflict"}/>
            </div>
          </div>
        </div>
      </main> 
    );
}