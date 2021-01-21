import {LitElement, html} from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';

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
            this.data = JSON.parse(http.responseText);
        }
    }

    async firstUpdated(props) {
        const connection = new WebSocket("ws://localhost:9092");
        connection.onmessage = function(event) {
            this.data = event.data;
            console.log(event.data);
        }
        this.requestUpdate();
    }
    
    render(){
        return html`
            <link rel="stylesheet" href="http://localhost:9091/css/dashboard.css">
            TEST
            ${this.data?.casters[0]?.displayName}
        `
    }
}

customElements.define('caster-info', CasterInfo);