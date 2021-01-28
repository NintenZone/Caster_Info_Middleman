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
                    <div class="score-footer">${this.data?.currentMatch?.roundName} | ${this.data?.currentMatch?.styleOfPlay}</div>
                </div>
            </div>
        `
    }
}

customElements.define('caster-info', CasterInfo);