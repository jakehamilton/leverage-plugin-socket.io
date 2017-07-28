const { server, Plugin } = require('leverage-js')
const io = require('socket.io')(server.__http_server__)

class WebSocket extends Plugin {
    constructor () {
        super()

        this.config = {
            type: 'websocket',
            websocket: {
                identifier: 'event'
            }
        }

        this.events = {
            global: {}
        }

        this.instances = {}

        io.on('connect', socket => {
            if (this.events.global.connect && this.events.global.connect.length > 0) {
                for (let component of this.events.global.connect) {
                    component.websocket(socket, io, 'connect')
                }
            }

            for (let event in this.events.global) {
                for (let component of this.events.global[event]) {
                    socket.on(event, (...args) => {
                        component.websocket(socket, io, ...args)
                    })
                }
            }
        })
    }

    websocket (component) {
        if (this.events[component.__config__.websocket.event]) {
            throw new Error(`[Leverage/plugin/websocket] Error adding websocket component, event ${component.__config__.websocket.event} already exists`)

            return
        }

        let namespace = 'global'

        if (component.__config__.websocket.namespace) {
            namespace = component.__config__.websocket.namespace
        }

        if (!this.instances[namespace]) {
            this._createInstance(namespace)
        }

        let events = [].concat(component.__config__.websocket.event)

        for (let event of events) {
            if (!this.events[namespace][event]) {
                this.events[namespace][event] = []
            }

            this.events[namespace][event].push(component)
        }
    }

    _createInstance (namespace) {
        this.instances[namespace] = io.of(namespace)

        this.instances[namespace].on('connect', socket => {
            for (let event in this.events[namespace]) {
                for (let component of this.events[event][namespace]) {
                    socket.on(event, (...args) => {
                        component.websocket(socket, this.instances[namespace], io, ...args)
                    })
                }
            }
        })
    }

    listen (port) {
        server.listen(port)
    }
}

module.exports = new WebSocket()
