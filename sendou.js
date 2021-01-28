const axios = require('axios');

let getPlayerData = async (playerID) => {
    return new Promise((resolve, reject) => {
        let res = axios.get("https://sendou.ink/_next/data/IzbD25TuhzFeL6ZQoMTpX/t.json").catch(e => {
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
    return new Promise((resolve, reject) => {
        let data = {};
        let res = axios.get("https://sendou.ink/_next/data/IzbD25TuhzFeL6ZQoMTpX/t.json").catch(null);
        
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
                    promises.push(getPlayerData(player));
                })

                await Promise.all(promises).then((values) => {
                    values.forEach((pres) => {
                        if (pres && !pres.notFound) {
                            players.push(pres);
                        }
                    })
                }).catch(e => {
                    return reject(e);
                })
            }
        }

        return resolve(data);
    });
}