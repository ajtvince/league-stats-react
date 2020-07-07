import React from 'react';
import { useState } from 'react';
import '../stylesheets/navigation.css';

function Navigation(props) {

    const [searchValue, setSearchValue] = useState(''); 

    return(
        <div className='navbarContainer'>
            <div className='navbar'>
            <div><a href="/">WhoToBan.gg</a></div>
            <div className='searchSummoner'>
                <form>
                    <input onChange={e => {setSearchValue('/na/' + e.target.value); console.log(searchValue)}} id="searchSummonerName" type='text' name='searchValue' placeholder='Summoner Name'></input>
                    <a href={searchValue}><button type="button">Search</button></a>
                </form>

            </div>
            </div>
        </div>
    );

}

function onSubmit(name) {
    if (name === "") {

    } else {
    console.log('submitted');
    window.location.href="/na/mlg420"
    }
}

export default Navigation;