# Actor.js

An actor environment for JS.

----

## A "Hello World!" example

```
Actors.register('Printer', function (mailbox) {
    this.print = function (message) {
        console.log(message.content);
    };
});
var Hello = Actors.register('Hello', function (mailbox) {
    this.main = function () {
        mailbox.send('Printer', 'Hello World!');
    };
});
Hello.main();
```
