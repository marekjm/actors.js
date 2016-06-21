/** Register an actor that will be receiving click messages, and
 *  an actor that will be printing messages to screen.
 *
 *  Actors.register() takes name of the actor and a constructor function, and
 *  registers new actor in a system (constructor function is new'ed by Actors.register()).
 *  This method returns the Actors object.
 */
Actors.register('ClickReceiver', function (mailbox) {
    this.consume = function (message) {
        console.log(message);
        if (message.content() != 'main') {
            mailbox.send('MessageBuilder', message.content());
        }
    };
});
Actors.register('MessageBuilder', function (mailbox) {
    this.consume = function (message) {
        var p = document.createElement('p');
        p.appendChild(document.createTextNode(JSON.stringify(message.content())));
        document.getElementById('messages').appendChild(p);
    };
});

/** Create a new actor.
 *
 *  Actors.Actor() is a constructor.
 *  It takes name of the actor and a constructor function, and returns an Actors.Actor object.
 *  Returned object may be used to send messages to the actor (it is a receptionist object, and
 *  it only forwards messages to the actual actor).
 */
var IntervalActor = (new Actors.Actor('Interval', function (mailbox) {
    var interval_id = undefined;

    function start() {
        if (interval_id === undefined) {
            interval_id = setInterval(function () {
                Actors.notify('MessageBuilder', 'Whooooosh!').kick();
            }, 1000);
            mailbox.send('MessageBuilder', 'started');
        } else {
            mailbox.send('MessageBuilder', 'Interval received start message while running');
        }
    }
    function stop() {
        if (interval_id !== undefined) {
            clearInterval(interval_id);
            interval_id = undefined;
            mailbox.send('MessageBuilder', 'stopped');
        } else {
            mailbox.send('MessageBuilder', 'Interval received stop message while not running');
        }
    }

    this.consume = function (message) {
        if (message.content() == 'start') {
            start();
        } else if (message.content() == 'stop') {
            stop();
        } else {
            mailbox.send('MessageBuilder', 'Interval actor got a bad message');
        }
    };
}));

(function () {
    document.getElementById('click-me-button').addEventListener('click', function (event) {
        Actors.notify('ClickReceiver', event).kick();
    });
    document.getElementById('start-interval-button').addEventListener('click', function (event) {
        Actors.notify('Interval', 'start').kick();
    });
    document.getElementById('stop-interval-button').addEventListener('click', function (event) {
        IntervalActor.notify('stop');
    });

    Actors.notify('Interval', 'start').kick();
    IntervalActor.notify('Spam');
})();
