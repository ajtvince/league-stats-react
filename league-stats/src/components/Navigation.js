import React from 'react';
import { useState } from 'react';
import '../stylesheets/navigation.css';

function Navigation(props) {

    const [searchValue, setSearchValue] = useState(''); 

    return(
        <div className='navbar'>
            <div>logo</div>
            <div className='searchSummoner'>
                <form>
                    <input onChange={e => {setSearchValue('/na/' + e.target.value); console.log(searchValue)}} type='text' name='searchValue' placeholder='Summoner Name'></input>
                    <a href={searchValue}><button onClick={() => window.location.href = searchValue} type="button">Search</button></a>
                </form>

            </div>
        </div>
    );
}

export default Navigation;