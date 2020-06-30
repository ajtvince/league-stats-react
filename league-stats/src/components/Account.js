import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams } from 'react-router-dom';
import ReactDOM from 'react-dom';
import SummonerPage from '../components/SummonerPage';
import { useEffect, useState } from 'react';

let apikey = "?api_key=RGAPI-f9bb6b8b-e871-44e4-aa5d-6c8ab910ef6d";
let summoner_name;

//set url param
function Account() {
  
    let { accountID } = useParams();
    summoner_name = accountID;

    return (
        <div onClick={getSummonerInfo(accountID)}>loading...</div>
    );

}

//get last 10 games from match history
async function getMatches(props, startNum) {
    console.log('Get matches props: ' + props.matches[0].gameId);

    let url = 'https://na1.api.riotgames.com/lol/match/v4/matches/';
    let url2 = 'https://na1.api.riotgames.com/lol/match/v4/timelines/by-match/';

    let last10 = [];

    let matchData;
    let matchesWR = [];

    let winsVs = [];
    let lossVs = [];


    for(let i=0; i<25; i++) {
        await fetch(url + props.matches[i].gameId + apikey)
            .then(resp => resp.json())
            .then(data => {
                matchData = data;
                //console.log('Get matches: ' + data.teams[0].win);
        });


        for(let i=0; i<10; i++) {
            //console.log(matchData.participantIdentities[i].player.summonerName);
            if (matchData.participantIdentities[i].player.summonerName === summoner_name) {
                console.log("name is same");
                console.log("team is " + matchData.participants[i].teamId)
                //get team id of player searched
                let teamId;
                let enemyTeamId;
                if (matchData.participants[i].teamId === 100) {
                    teamId = 0;
                    enemyTeamId = 1;
                } else {
                    teamId = 1;
                    enemyTeamId = 0;
                }
                console.log("did team win: " + matchData.teams[teamId].win);
                //get enemy team id
                let enemyTeam;
                if(teamId === 0) {
                    enemyTeam = 200;
                } else {
                    enemyTeam = 100;
                }

                //get champions on enemy team and determine if loss or win
                for (let i=0; i<10; i++) {
                    if (matchData.participants[i].teamId === enemyTeam && matchData.teams[teamId].win === "Win") {
                        console.log("player won vs " + matchData.participants[i].championId + " on team " + enemyTeam);
                        winsVs.push(matchData.participants[i].championId);
                    } else if (matchData.participants[i].teamId === enemyTeam && matchData.teams[teamId].win === "Fail") {
                        console.log("player lost vs " + matchData.participants[i].championId + " on team " + enemyTeam);
                        lossVs.push(matchData.participants[i].championId);
                    }
                }

                

            }
        }

        //console.log(matchesWR);

        /*
        await fetch(url2 + props.matches[i].gameId + apikey)
            .then(resp => resp.json())
            .then(data => {
                let matchTimeline = data;
                console.log('get matches2' + data.minionsKilled);
            })
        */
        let champSplashURL = '/images/champions/splash/';
        let champKey =  await getChampName(props.matches[i].champion);
        champKey += '_0.jpg';
        console.log(champKey);
        
        last10[i] = <div className='matchContainer'>
            <div className='matchMainContainer'>
                <img src={champSplashURL + champKey}></img>
                <div onClick={() => { 
                    if (document.getElementsByClassName('matchMoreInfoContainer')[i].style.height === '0px') 
                        document.getElementsByClassName('matchMoreInfoContainer')[i].style.height='200px'
                    else
                        document.getElementsByClassName('matchMoreInfoContainer')[i].style.height = '0px'
                    }} id="expandMatch">expand match</div>
            </div>
            <div className='matchMoreInfoContainer' style={{height:'0px'}}>
                <div className='playerContainer'>
                    <div style={{width:'24px', height:'24px', backgroundColor:'red', borderRadius:'24px'}}></div>
                    <a href={'/na/' + matchData.participantIdentities[0].player.summonerName}>{matchData.participantIdentities[0].player.summonerName}</a>&nbsp;
                    <div>6/</div>
                    <div>2/</div>
                    <div>12</div>
                </div>
                <div>
                    <a href={'/na/' + matchData.participantIdentities[1].player.summonerName}>{matchData.participantIdentities[1].player.summonerName}</a>
                </div>
                <div>
                    <a href={'/na/' + matchData.participantIdentities[2].player.summonerName}>{matchData.participantIdentities[2].player.summonerName}</a>
                </div>
                <div>
                    <a href={'/na/' + matchData.participantIdentities[3].player.summonerName}>{matchData.participantIdentities[3].player.summonerName}</a>
                </div>
                <div>
                    <a href={'/na/' + matchData.participantIdentities[4].player.summonerName}>{matchData.participantIdentities[4].player.summonerName}</a>
                </div>
                <div>
                    <a href={'/na/' + matchData.participantIdentities[5].player.summonerName}>{matchData.participantIdentities[5].player.summonerName}</a>
                </div>
                <div>
                    <a href={'/na/' + matchData.participantIdentities[6].player.summonerName}>{matchData.participantIdentities[6].player.summonerName}</a>
                </div>
                <div>
                    <a href={'/na/' + matchData.participantIdentities[7].player.summonerName}>{matchData.participantIdentities[7].player.summonerName}</a>
                </div>
                <div>
                    <a href={'/na/' + matchData.participantIdentities[8].player.summonerName}>{matchData.participantIdentities[8].player.summonerName}</a>
                </div>
                <div>
                    <a href={'/na/' + matchData.participantIdentities[9].player.summonerName}>{matchData.participantIdentities[9].player.summonerName}</a>
                </div>
            </div>
        </div>
    }

    console.log("won vs: " + winsVs);
    console.log("lost vs: " + lossVs);
    //object with champion ids and wins/losses vs them
    let winsCount = {};
    let lossCount = {};

    winsVs.forEach(function(i) { winsCount[i] = (winsCount[i] || 0) + 1;});
    lossVs.forEach(function(i) { lossCount[i] = (lossCount[i] || 0) + 1;});

    console.log(winsCount);
    console.log(lossCount);

    //get champion id (property name) and number of games vs (value)
    let lossKeys = Object.keys(lossCount);
    let mostLosses = 0;
    let mostLossKey;
    for(let i=0; i<Object.keys(lossCount).length; i++) {
        console.log("champion: " + lossKeys[i] + " losses against: " + lossCount[lossKeys[i]]);
        if (lossCount[lossKeys[i]] > mostLosses) {
            mostLosses = lossCount[lossKeys[i]];
            mostLossKey = i;
        } 
    }

    let mostLossChamp = await getChampName(lossKeys[mostLossKey]);

    console.log("The most losses you have is against champion " + mostLossChamp + " with " + mostLosses + " losses");

    console.log(last10)
    return last10;

}

//get champion name based on champion key
async function getChampName(id) {

    let champData;

    await fetch('https://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion.json')
    .then(response => {
      return response.json()
    })
    .then(data => {
      champData = Object.entries(data.data);
    })
    .catch(err => {
        console.log('error: ' + err)
    })

    for(let i=0; i<champData.length; i++) {
        if (id == champData[i][1].key) {
            console.log('match found ' + champData[i][0]);
            let champ = champData[i][0];
            return champ;
        }
    }

}

async function getSummonerInfo(id) {

    //account
    let url = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + id + apikey;

    let account;

    await fetch(url)
        .then(resp => resp.json())
        .then(data => {
            account = data;
    });
    console.log(Object.keys(account))
    console.log(account);

    if (Object.keys(account).length == 1 ) {
        console.log(Object.keys(account))
    } else { 
        console.log(account);
        let match = await getMatchHistory(account.accountId);
        let loadingContent = <div>Loading...</div>
        ReactDOM.render(<SummonerPage summoner={account} history={match} last10={loadingContent}/>, document.getElementById('root'));
        let matches = await getMatches(match);
        ReactDOM.render(<SummonerPage summoner={account} history={match} last10={matches}/>, document.getElementById('root'));
    }


}

async function getMatchHistory(id) {
        //match history
    let accountid = id;

    let url = "https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/" + accountid + apikey;

    let match;

    await fetch(url)
        .then(resp => resp.json())
        .then(data => {
            match = data;
            console.log(data);
    });
 
    if (Object.keys(match).length == 1 ) {
        console.log(Object.keys(match));
        return null;
    } else { 
        console.log(match.matches[0]);
        return match;
    }
}

export default Account;
