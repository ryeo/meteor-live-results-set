seed = function () {
  Posts.remove({});

  for (var i = 0; i < 3; i++) {
    Posts.insert({
      subject: 'Post ' + i,
      topic_id: null
    });
  }

  for (var i = 4; i < 7; i++) {
    Posts.insert({
      subject: 'Post ' + i,
      topic_id: 1 
    });
  }
}

var _diffQueryChanges = LocalCollection._diffQueryChanges;

LocalCollection._diffQueryChanges = function (ordered, oldResults, newResults, observer) {
  console.log('** diffing **');
  return _diffQueryChanges.apply(this, arguments);
};

var clientCount = 0;
var clients = {};

log = function (action, id, fields) {
  var sub = this;

  fields = fields ? EJSON.stringify(fields) : '';
  console.log('<' + clients[sub._session.id] + ': ' + sub._name + '> ' +
    action + ' ' + fields || id);
};

observe = function (subscription, cursorFn) {
  var sessionId = subscription._session.id
    , cursor = cursorFn()
    , handle;

  if (!clients[sessionId])
    clients[sessionId] = ++clientCount;

  handle = cursor.observeChanges({
    added: function (id, fields) {
      log.call(subscription, 'added', id, fields);
      subscription.added('posts', id, fields);
    },

    changed: function (id, fields) {
      log.call(subscription, 'changed', id, fields);
      subscription.changed('posts', id, fields);
    },

    removed: function (id) {
      log.call(subscription, 'removed', id);
      subscription.removed('posts', id);
    }
  });

  subscription.ready();

  subscription.onStop(function () {
    handle.stop();
  });
};
