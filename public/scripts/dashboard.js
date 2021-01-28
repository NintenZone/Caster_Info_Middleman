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
}

customElements.define('caster-info', CasterInfo);