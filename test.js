const { manager, Middleware, Component } = require('leverage-js')
const http = require('leverage-plugin-http')
const websocket = require('./index')
const express = require('express')

manager.add(Component.of({
    config: {
        type: 'websocket',
        websocket: {
            event: 'connect'
        }
    },
    websocket (socket, io) {
        socket.emit('pong')
    }
}))

manager.middleware(Middleware.of({
    config: {
        type: 'http',
        http: {
            custom: (app) => {
                app.use('/node_modules', express.static('node_modules'))
                app.use(express.static('public'))
            }
        }
    }
}))

manager.plugin(websocket)
manager.plugin(http)

websocket.listen(3000)
