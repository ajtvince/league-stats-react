import React from 'react';
import '../stylesheets/summonerPage.css'
import Navigation from '../components/Navigation';

function SummonerPage(props) {
    
    console.log(props.history);

    return(
        <div>
        <Navigation />
        <div className='summonerContainer'>
            <div id='profileContainer'>
                <div id="profileInfo">
                    <div id='profileIcon'><img src={"/images/profileicon/" + props.summoner.profileIconId + ".png"}></img></div>
                    <div id='summonerName'>{props.summoner.name}</div>
                    <div id='summonerLevel'>{props.summoner.summonerLevel}</div>
                </div>
                <div>{props.ranked}</div>
            </div>
            <div className='matchHistoryContainer'>
                {props.whoToBan}
            </div>
        </div>
        </div>
    );
}

async function loadMoreMatches() {

}



export default SummonerPage;