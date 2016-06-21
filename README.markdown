# Actor.js

An actor environment for JS.

----

## A "Hello World!" example

```
// Register an actor in the system.
Actors.register('Printer', function (mailbox) {
    this.consume = function (message) {
        console.log(message.content);
    };
});

// Register new actor, and create a direct proxy object for communication
// with it.
var HelloActor = (new Actors.Actor('Hello', function (mailbox) {
    this.consume = function (message) {
        if (message.content == 'main') {
            mailbox.send('Printer', 'Hello World!');
        }
    };
}));

// Send first message to start the system.
HelloActor.notify('main');
```


### More examples

More examples can be found in `index.html` and `index.js` files.


----

## Why actors?

Using actors, there is no global shared state.
Each actor has its own state, hidden from everybody else and
can only communicate with the outside world using its mailbox, via message passing.

The simple model enforced by actors is also very useful for keeping application
modules small, and loosely coupled.


----

## License, copying, usage

This is alpha software, written primarily as an experiment.
The code is licensed under GNU GPL v2 or GNU GPL v3; you as end user may choose
which version of the license you prefer.
