const axios = require('axios');

let getPlayerData = async (playerID) => {
    return new Promise(async (resolve, reject) => {
        let res = await axios.get(`https://sendou.ink/_next/data/R37mWiZ6gg_JlECsqQOQs/u/${playerID}.json`).catch(e => {
            return reject(e);
        })

        if (res && res.data) {
            return resolve(res.data);
        }
        else {
            return reject("There was an unkown error.")
        }
    });
}

exports.getFullDataFromTeam = async (team) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        let res = await axios.get("https://sendou.ink/_next/data/R37mWiZ6gg_JlECsqQOQs/t.json").catch(null);
        
        if (res && res.data) res = res.data;
        else return data;

        let query;
        let type;

        if (team.sendouLink) {
            query = team.sendouLink;
            type = ['nameForUrl'];
        } 
        else {
            query = team.displayName;
            type = ['name'];
        }

        res.pageProps.teams.forEach((team) => {
            if (team[type].toLowerCase() === query.toLowerCase()) return data['teamData'] = team;
        })

        if (data.teamData && data.teamData.roster) {
            if (data.teamData.roster.size < 1) return;

            else {
                let players = [];
                let promises = [];
                data.teamData.roster.forEach((player) => {
                    promises.push(getPlayerData(player.id));
                })

                await Promise.all(promises).then((values) => {
                    values.forEach((pres) => {
                        if (pres && !pres.notFound) {
                            let pdata = pres.pageProps.user;
                            if (pres.pageProps.peakXPowers) pdata.peakXPowers = pres.pageProps.peakXPowers;
                            if (pres.pageProps.peakLeaguePowers) pdata.peakLeaguePowers = pres.pageProps.peakLeaguePowers;
                            players.push(pres.pageProps.user);
                        }
                    })
                }).catch(e => {
                    return reject(e);
                })

                data['players'] = players;
            }
        }

        return resolve(data);
    });
}
