WebSockets for [Leverage](http://github.com/jakehamilton/leverage)!
=========================

This plugin supports the `websocket` component and middleware types.

Config
------

```js
{
    event: 'event-name',
    namespace: '/my-namespace' // optional
}
```

Example
-------

```js
import { Component } from 'leverage-js'

class MyComponent extends Component {
  constructor () {
    super()

    this.config = {
      type: 'websocket',
      websocket: {
        /*
         * Specify an event
         */
        event: 'ping',

        /*
         * Optionally specify a namespace
         */
        namespace: '/my-namespace'
      }
    }
  }

  /*
   * Then the callback for our type. This is supplied with
   *  the `data` and `socket` for this request, and the
   *  global `io` instance.
   */
  websocket (socket, io, ...data) {
    socket.emit('pong')
  }
}
```

Then just make sure to add the plugin to Leverage's manager along with your component instance!
Here, we'll also use the [`http`](http://github.com/jakehamilton/leverage-plugin-http) middleware to start the server listening.

```js
import http from 'leverage-plugin-http'
import websocket from 'leverage-plugin-socket.io'
import { manager } from 'leverage-js'

/* ... all the code from the previous example ... */

manager.plugin(http)
manager.plugin(websocket)

manager.add(new MyComponent) 

/*
 * Don't forget to listen on a port!
 */
http.listen(3000)
```
