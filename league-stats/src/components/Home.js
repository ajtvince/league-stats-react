import React from 'react';
import { useState } from 'react';
import '../stylesheets/homePage.css'

function Home(props) {

    const [searchValue, setSearchValue] = useState(''); 

    return(
        <div className='home'>
            <div>WhoToBan.gg</div>
            <div className='searchSummonerHome'>
                <form>
                    <input onChange={e => {setSearchValue('/na/' + e.target.value); console.log(searchValue)}} id="searchSummonerName" type='text' name='searchValue' placeholder='Summoner Name'></input>
                    <a href={searchValue}><button type="button">Search</button></a>
                </form>
            </div>
            <div>
                <p>Want to know which champion you've lost to the most this season? Or which champion you have the most wins against?</p>
                <p>Find out who you may want to ban, or not ban, based on your ranked statistics.</p>
            </div>
        </div>
    );

}

export default Home;