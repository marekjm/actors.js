var Actors = (new (function () {
    var actors = {};
    var mailboxes = {};

    function Mailbox(name) {
        var actor = undefined;
        var queue = [];

        this.attach = function (a) {
            actor = a;
            return this;
        };

        this.append = function (msg) {
            queue.push(msg);
        };

        this.named = function () {
            return name;
        };

        this.execute = function () {
            if (!queue.length) {
                return 0;
            }

            while (queue.length) {
                let message = queue[0];
                actor.consume(message);
                queue = queue.slice(1);
            }

            return 1;
        };

        this.send = function (recipient, content) {
            Actors.deliever(name, recipient, content);
        };
    }

    function Message(from, to, what) {
        this.reply = function (message) {
            Actors.deliever(to, from, message);
        };

        this.sender = function () {
            return from;
        };
        this.recipient = function () {
            return to;
        };
        this.content = function () {
            return what;
        };
    }

    this.deliever = function (actor, recipient, content) {
        mailboxes[recipient].append(new Message(actor, recipient, content));
        return this;
    };
    this.notify = function (recipient, content) {
        return this.deliever(undefined, recipient, content);
    };

    this.register = function (name, actor) {
        var mb = (new Mailbox(name));
        var a = undefined;

        try {
            a = (new actor(mb));
        } catch (e) {
            throw ('Actors.register(\'' + name + '\', ...): ' + e);
        }

        if ((typeof a.consume) !== 'function') {
            throw (name + '.consume is not a function');
        }

        mailboxes[name] = mb.attach(a);
        actors[name] = a;

        return this;
    };

    this.kick = function () {
        var messages_routed = 0;
        while (true) {
            messages_routed = 0;

            Object.keys(mailboxes).forEach(function (name) {
                messages_routed += mailboxes[name].execute();
            });

            if (!messages_routed) {
                break;
            }
        }
    };
}));

Actors.Actor = function (name, actor) {
    Actors.register(name, actor);

    this.notify = function (message) {
        Actors.notify(name, message).kick();
    };
};

Actors.OK = true;
