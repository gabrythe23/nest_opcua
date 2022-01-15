const app = new Vue({
    el: '#app',
    data: { 
        messages: [],
        socket: null
    },
    methods: {
        receivedMessage(message) {
            this.messages.push(message)
        }
    },
    created() {
        this.socket = io('http://localhost:3000')
        this.socket.on('msgToClient', (message) => {
            this.receivedMessage(message)
        })
    }
})
