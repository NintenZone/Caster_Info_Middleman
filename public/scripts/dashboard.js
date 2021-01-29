import { LitElement, html } from 'https://unpkg.com/lit-element@2.4.0/lit-element.js?module';

class CasterInfo extends LitElement {

    static get properties() {
        return {
            data: {type: Object}
        }
    }

    constructor() {
        super();

        fetch('http://localhost:9091/data')
            .then(res => res.json())
            .then(data => this.data = data);

        const handleSocketMessage = (e) => {
            console.log(JSON.parse(e.data));
            this.data = JSON.parse(e.data);
            this.requestUpdate();
        }

        const socket = new WebSocket('ws://localhost:9092');
        socket.onmessage = handleSocketMessage.bind(this);
    }

    async firstUpdated(props) {

    }
    
    render(){
        return html`
            <link rel="stylesheet" href="http://localhost:9091/css/dashboard.css">
            <div class="body">
                <div class="caster-container">
                    ${this.data?.casters?.map(
                        (caster) => 
                        this.getCasterDivs(caster)
                    )}
                </div>

                <div class="scoreboard">
                    <div class="score-team-container">
                        <div class="score-color" style="background-color: ${this.data?.currentMatch?.currentColors?.colorA}"></div>
                        <div class="teamName">${this.data?.currentMatch?.teamA?.displayName}  |  ${this.data?.currentMatch?.scoreA}</div>
                    </div>
                    <div class="score-team-container">
                        <div class="score-color" style="background-color: ${this.data?.currentMatch?.currentColors?.colorB}"></div>
                        <div class="teamName">${this.data?.currentMatch?.teamB?.displayName}  |  ${this.data?.currentMatch?.scoreB}</div>
                    </div>
                    <div class="white-sep"></div>
                    <div class="score-footer">${this.data?.currentMatch?.roundName} | ${this.data?.currentMatch?.styleOfPlay}</div>
                </div>

                <div class="maplist-container">
                    <div class="maplist-header">
                        <div class="header-text">Maplist</div>
                    </div>
                    <div class="white-sep"></div>
                    <div class="maplist-body">
                        ${this.data?.currentMatch?.games?.map(
                            (game) =>
                            this.getMapDiv(game)
                        )}
                    </div>
                </div>

                <div class="roster-container">
                    ${this.getRosterDivs(this.data?.currentMatch?.teamA)}
                    ${this.getRosterDivs(this.data?.currentMatch?.teamB)}
                </div>

                <div class="sendou-module">
                    ${this.getSendou(this.data?.sink?.teamA)}
                    ${this.getSendou(this.data?.sink?.teamB)}
                </div>
            </div>
        `
    }

    getCasterDivs(caster) {
        return html`
            <div class="caster">
                ${caster?.displayName} (${caster?.details?.pronouns?.detailText})
            </div>
        `
    }

    getMapDiv(game) {
        let abbr = "??";

        if (game.mode.toLowerCase() === "splat zones") {
            abbr = "SZ";
        }
        else if (game.mode.toLowerCase() === "tower control") {
            abbr = "TC";
        }
        else if (game.mode.toLowerCase() === "rainmaker") {
            abbr = "RM";
        }
        else if (game.mode.toLowerCase() === "clam blitz") {
            abbr = "CB";
        }
        else if (game.mode.toLowerCase() === "counterpick") {
            abbr = "CP";
        }
        else if (game.mode.toLowerCase() === "turf war") {
            abbr = "TW";
        }
        else if (game.mode.toLowerCase() === "random") {
            abbr = "RD";
        }

        return html`
        <div class="map-container">
            <div class="map-mode">${abbr}</div>
            <div class="map-name">${game.map}</div>
        </div>
        `
    }

    getRosterDivs(team) {
        return html`
            <div class="roster-team-container">
                <div class="header">${team?.displayName}</div>
                <div class="white-sep"></div>
                ${team?.players?.map(
                    (player) => 
                    this.getRosterPlayers(player)
                )}
            </div>
        `
    }

    getRosterPlayers(player) {
        return html`
            <div class="roster-player">
                ${player?.name}
            </div>
        `
    }

    getSendou(team) {
        return html`
            <div class="sendou-team">
                <div class="sendou-header">${team?.teamData?.name}</div>
                <div class="white-sep"></div>
                ${team?.players?.map(
                    (player) => 
                    this.getSendouPlayer(player)
                )}
            </div>
        `
    }

    getSendouPlayer(player) {
        let peakX = [];
        let peakLeague = [];

        if (player.peakXPowers) {
            for (const [key, value] of Object.entries(player.peakXPowers)) {
                peakX.push(`${key}: ${value}`)
            }
        }

        if (player.peakLeaguePowers) {
            for (const [key, value] of Object.entries(player.peakLeaguePowers)) {
                peakLeague.push(`${key}: ${value}`)
            }
        }

        return html`
            <div class="sendou-player">
                <div class="sendou-player-main">
                    <div class="sendou-flag"><img src="http://localhost:9091/img/flags/${(player?.profile?.country) ? player?.profile?.country?.toUpperCase() : "_unknown"}.png"></div>
                    <div class="sendou-player-name">${player.username}</div>
                </div>
                
                <div class="sendou-player-weapons">${player?.profile?.weaponPool?.join(" | ")}</div>
                <div class="peak-x">
                    ${peakX.join(' | ')}
                </div>
                <div class="peak-league">
                    ${peakLeague.join(' | ')}
                </div>
            </div>        
        `
    }
}

customElements.define('caster-info', CasterInfo);
