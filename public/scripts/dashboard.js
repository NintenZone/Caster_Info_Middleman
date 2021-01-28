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
            TEST
            ${this.data?.test}
        `
    }
}

customElements.define('caster-info', CasterInfo);