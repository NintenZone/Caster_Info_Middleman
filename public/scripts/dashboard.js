import { LitElement, html } from 'https://unpkg.com/lit-element@2.4.0/lit-element.js?module';

const http = new XMLHttpRequest();

class CasterInfo extends LitElement {

    static get properties() {
        return {
            data: {type: Object}
        }
    }

    constructor() {
        super();
        http.open("GET", 'http://localhost:9091/data');
        http.send();

        http.onreadystatechange= (e) => {
            try {
                this.data = JSON.parse(http.responseText);
            }
            catch(e) {
                return;
            }
        }

        const socket = new WebSocket('ws://localhost:9092');
        socket.onmessage = function(event) {
            console.log(JSON.parse(event.data));
            this.data = JSON.parse(event.data);
            this.requestUpdate();
        };
    }

    async firstUpdated(props) {

    }
    
    render(){
        return html`
            <link rel="stylesheet" href="http://localhost:9091/css/dashboard.css">
            TEST
            ${this.data?.test}
        `
    }
}

customElements.define('caster-info', CasterInfo);