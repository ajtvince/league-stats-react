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
    //let url2 = 'https://na1.api.riotgames.com/lol/match/v4/timelines/by-match/';

    //let last10 = [<div>test</div>];

    let matchData;
    let matchesWR = [];

    let winsVs = [];
    let lossVs = [];


    for(let i=0; i<50 ; i++) {
        await fetch(url + props.matches[i].gameId + apikey)
            .then(resp => resp.json())
            .then(data => {
                matchData = data;
                //console.log('Get matches: ' + data.teams[0].win);
        });

        console.log(summoner_name);
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
        
        /*
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
        */
    }

    let champPicURL = '/images/champions/splash/';
    let champPicKey = '_0.jpg';

    let whoToBan = [];
    let whoToBanTieW = [];
    let whoToBanTieL = [];

    console.log("won vs: " + winsVs);
    console.log("lost vs: " + lossVs);
    //object with champion ids and wins/losses vs them
    let winsCount = {};
    let lossCount = {};

    winsVs.forEach(function(i) { winsCount[i] = (winsCount[i] || 0) + 1;});
    lossVs.forEach(function(i) { lossCount[i] = (lossCount[i] || 0) + 1;});

    console.log(winsCount);
    console.log(lossCount);

    //get champion id (property name) and number of games lossed vs (value)
    let lossKeys = Object.keys(lossCount);
    let mostLosses = 0;
    let mostLossKey = [];
    let lossKeyCount = 0;
    for(let i=0; i<Object.keys(lossCount).length; i++) {
        console.log("champion: " + lossKeys[i] + " losses against: " + lossCount[lossKeys[i]]);
        if (lossCount[lossKeys[i]] > mostLosses) {
            mostLosses = lossCount[lossKeys[i]];
            lossKeyCount = 0;
            mostLossKey = [];
            mostLossKey[lossKeyCount] = i;
        } else if (lossCount[lossKeys[i]] === mostLosses) {
            lossKeyCount++;
            mostLossKey[lossKeyCount] = i;
        }
    }

    //get champion id (property name) and number of games won vs (value)
    let winKeys = Object.keys(winsCount);
    let mostWins = 0;
    let mostWinKey = [];
    let winKeyCount = 0;
    for(let i=0; i<Object.keys(winsCount).length; i++) {
        console.log("champion: " + winKeys[i] + " wins against: " + winsCount[winKeys[i]]);
        if (winsCount[winKeys[i]] > mostWins) {
            mostWins = winsCount[winKeys[i]];
            winKeyCount = 0;
            mostWinKey = [];
            mostWinKey[winKeyCount] = i;
        } else if (winsCount[winKeys[i]] === mostWins) {
            winKeyCount++;
            mostWinKey[winKeyCount] = i;
        }
    }

    let mostWinChamp = "";
    let mostLossChamp = "";

    if (mostLossKey.length === 1) {
        mostLossChamp = await getChampName(lossKeys[mostLossKey[0]]);
        console.log("The most losses you have is against " + mostLossChamp + " with " + mostLosses + " losses");
        let winsRecord = 0;
        if (winsCount[lossKeys[mostLossKey[0]]] > 0) {
            winsRecord = winsCount[lossKeys[mostLossKey[0]]];
        }
        whoToBan[0] = <div class="whoToBanContainer"><div><img src={champPicURL + mostLossChamp + champPicKey}></img></div><div><p>You might want to ban {mostLossChamp}.</p><p>You're most losses is vs them ({mostLosses}).</p><p>You're record vs them is {winsRecord}-{mostLosses} ({(winsRecord / (mostLosses +  winsRecord) * 100).toFixed(2)}%).</p> </div></div>;
    } else {
        for (let i=0; i<mostLossKey.length; i++) {
            mostLossChamp = await getChampName(lossKeys[mostLossKey[i]]);
            let winsRecord = 0;
            if (winsCount[lossKeys[mostLossKey[i]]] > 0) {
                winsRecord = winsCount[lossKeys[mostLossKey[i]]];
            }
            whoToBanTieL[i] = <div class="whoToBanContainer"><div><img src={champPicURL + mostLossChamp + champPicKey}></img></div><div><p>You might want to ban {mostLossChamp}.</p><p>You're tied for most losses vs them ({mostLosses}).</p><p>You're record vs them is {winsRecord}-{mostLosses} ({(winsRecord / (mostLosses +  winsRecord) * 100).toFixed(2)}%).</p> </div></div>;
        }
        //mostLossChamp = mostLossChamp.slice(0, -2);
        console.log("The most losses you have is against " + mostLossChamp + " with " + mostLosses + " losses each");
        whoToBan[0] = whoToBanTieL;
    }
 
 
    if (mostWinKey.length === 1) {
        mostWinChamp = await getChampName(winKeys[mostWinKey[0]]);
        console.log("The most wins you have is against " + mostWinChamp + " with " + mostWins + " wins");
        let lossRecord = 0;
        if (lossCount[winKeys[mostWinKey[0]]] > 0) {
            lossRecord = lossCount[winKeys[mostWinKey[0]]];
        }
        whoToBan[1] = <div class="whoToBanContainer"><div><img src={champPicURL + mostWinChamp + champPicKey}></img></div><div><p>You're good against {mostWinChamp}.</p><p>You're most wins is vs them ({mostWins}).</p><p>You're record vs them is {mostWins}-{lossRecord} ({(mostWins / (mostWins +  lossRecord) * 100).toFixed(2)}%).</p> </div></div>;
    } else {
        for (let i=0; i<mostWinKey.length; i++) {
        mostWinChamp = await getChampName(winKeys[mostWinKey[i]]);
        let lossRecord = 0;
        if (lossCount[winKeys[mostWinKey[i]]] > 0) {
            lossRecord = lossCount[winKeys[mostWinKey[i]]];
        }
        let goodOrBadVs = "good";
        if (.5 >= (mostWins / (mostWins + lossRecord)) >= .3 ) {
            goodOrBadVs = "okay";
        } else if ((mostWins / (mostWins + lossRecord)) < .3 ) {
            goodOrBadVs = "bad";
        }
    whoToBanTieW[i] = <div class="whoToBanContainer"><div><img src={champPicURL + mostWinChamp + champPicKey}></img></div><div><p>You're {goodOrBadVs} against {mostWinChamp}.</p><p>You're tied for most wins vs them ({mostWins}).</p><p>You're record vs them is {mostWins}-{lossRecord} ({(mostWins / (mostWins +  lossRecord) * 100).toFixed(2)}%).</p> </div></div>;
        }

        //mostWinChamp = mostWinChamp.slice(0, -2);
        console.log("The most wins you have is against " + mostWinChamp + " with " + mostWins + " wins each");
        whoToBan[1] = whoToBanTieW;
    }


    console.log(champPicURL + mostWinChamp + champPicKey);


    console.log(whoToBan)
    return whoToBan;

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

    if (Object.keys(account).length === 1 ) {
        console.log(Object.keys(account))
    } else { 
        console.log(account);
        let rankedInfo = await getRankedInfo(account.id);
        summoner_name=account.name;
        let match = await getMatchHistory(account.accountId);
        let loadingContent = <div id="loadingContent"><div>Loading...</div><div>Please do not refresh this page. The more games you have played this season, the longer it will take to load your matches.</div></div>
        ReactDOM.render(<SummonerPage summoner={account} ranked={rankedInfo} history={match} whoToBan={loadingContent}/>, document.getElementById('root'));
        let matches = await getMatches(match);
        ReactDOM.render(<SummonerPage summoner={account} ranked={rankedInfo} history={match} whoToBan={matches}/>, document.getElementById('root'));
    }


}


async function getRankedInfo(id) {
    let summonerId = id;
    let url = "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + summonerId + apikey;

    let rankedAccount;

    await fetch(url)
        .then(resp => resp.json())
        .then(data => {
            rankedAccount = data;
            console.log(data);
        });

    let returnArray = [];
    let rankedIconURL = "/images/rankedIcon/Emblem_";

    if (rankedAccount.length === 0) {
        returnArray[0] = <div class="unranked">Unranked in Solo/Duo and Flex</div>


        return returnArray;
    }

    if (rankedAccount.length > 1) {
        console.log("account length > 1");
        if (rankedAccount[0].queueType === "RANKED_SOLO_5x5") {
            console.log("queue type 1 is solo");
            let queueTypeSolo = "SOLO/DUO";
            let queueTypeFlex = "FLEX";

            returnArray[0] = <div class="rankedQueueInfo">
                <img src={rankedIconURL + rankedAccount[0].tier + ".png"}></img>
                <div class="queueType">{queueTypeSolo}</div>
                <div class="queueRank">{rankedAccount[0].tier} {rankedAccount[0].rank} ({rankedAccount[0].leaguePoints} LP)</div>
                <div class="queueWR">{rankedAccount[0].wins} - {rankedAccount[0].losses} ({(rankedAccount[0].wins / (rankedAccount[0].wins + rankedAccount[0].losses)  * 100).toFixed(2)}%)</div>
                </div>

            returnArray[1] = <div class="rankedQueueInfo">
            <img src={rankedIconURL + rankedAccount[1].tier + ".png"}></img>
            <div class="queueType">{queueTypeFlex}</div>
            <div class="queueRank">{rankedAccount[1].tier} {rankedAccount[1].rank} ({rankedAccount[1].leaguePoints} LP)</div>
            <div class="queueWR">{rankedAccount[1].wins} - {rankedAccount[1].losses} ({(rankedAccount[1].wins / (rankedAccount[1].wins + rankedAccount[1].losses)  * 100).toFixed(2)}%)</div>
            </div>

        } else {
            console.log("queue type 2 is solo");

            let queueTypeSolo = "SOLO/DUO";
            let queueTypeFlex = "FLEX";
    
            returnArray[0] = <div class="rankedQueueInfo">
                <img src={rankedIconURL + rankedAccount[1].tier + ".png"}></img>
                <div class="queueType">{queueTypeSolo}</div>
                <div class="queueRank">{rankedAccount[1].tier} {rankedAccount[1].rank} ({rankedAccount[1].leaguePoints} LP)</div>
                <div class="queueWR">{rankedAccount[1].wins} - {rankedAccount[1].losses} ({(rankedAccount[1].wins / (rankedAccount[1].wins + rankedAccount[1].losses) * 100).toFixed(2)}%)</div>
                </div>

            returnArray[1] = <div class="rankedQueueInfo">
                <img src={rankedIconURL + rankedAccount[0].tier + ".png"}></img>
                <div class="queueType">{queueTypeFlex}</div>
                <div class="queueRank">{rankedAccount[0].tier} {rankedAccount[0].rank} ({rankedAccount[0].leaguePoints} LP)</div>
                <div class="queueWR">{rankedAccount[0].wins} - {rankedAccount[0].losses} ({(rankedAccount[0].wins / (rankedAccount[0].wins + rankedAccount[0].losses) * 100).toFixed(2)}%)</div>
                </div>
        }
    } else {
        console.log("only 1 queue type");

        let queueType;
        let queueType2;
        if (rankedAccount[0].queueType === "RANKED_SOLO_5x5") {
            queueType = "SOLO/DUO";
            queueType2 = "FLEX";
        } else {
            queueType = "FLEX";
            queueType2 = "SOLO/DUO";
        }
        returnArray[0] = <div class="rankedQueueInfo">
            <img src={rankedIconURL + rankedAccount[0].tier + ".png"}></img>
            <div class="queueType">{queueType}</div>
            <div class="queueRank">{rankedAccount[0].tier} {rankedAccount[0].rank} ({rankedAccount[0].leaguePoints} LP)</div>
            <div class="queueWR">{rankedAccount[0].wins} - {rankedAccount[0].losses} ({(rankedAccount[0].wins / (rankedAccount[0].wins + rankedAccount[0].losses) * 100).toFixed(2)}%)</div>
            </div>
        returnArray[1] = <div class="rankedQueueInfo" id="unrankedQueueInfo"><div id="unrankedQueue">Unranked in {queueType2}</div></div>
    }


    return returnArray;


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
 
    if (Object.keys(match).length === 1 ) {
        console.log(Object.keys(match));
        return null;
    } else { 
        console.log(match.matches[0]);
        return match;
    }
}

export default Account;
