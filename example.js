require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var emitter = new _eventemitter32['default']();

var posts = {};

// generate set of posts with random upvotes
for (var i = 1; i <= 3; i++) {
    posts[i] = {
        title: 'Post #' + i,
        upvotes: Math.floor(Math.random() * 10)
    };
}

function getPosts() {
    return Object.keys(posts).map(function (id) {
        return {
            id: id,
            title: posts[id].title,
            upvotes: posts[id].upvotes
        };
    });
}

function emit() {
    emitter.emit('posts-updated', getPosts());
}

function upvote(id) {
    posts[id].upvotes += 1;
    emit();
}

function downvote(id) {
    posts[id].upvotes -= 1;
    emit();
}

var Posts = {
    getPosts: getPosts,
    listen: function listen(cb) {
        return emitter.addListener('posts-updated', cb);
    },
    upvote: upvote,
    downvote: downvote
};

exports['default'] = Posts;
module.exports = exports['default'];

},{"eventemitter3":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var emitter = new _eventemitter32['default']();

var defaultUser = {
    id: 0,
    isLoggedIn: false,
    votes: {}
};

var user = {
    id: 1,
    isLoggedIn: true,
    votes: {}
};

var currentUser = defaultUser;

function getUser() {
    return currentUser;
}

function emit() {
    emitter.emit('user-updated', getUser());
}

function login() {
    currentUser = user;
    emit();
}

function logout() {
    currentUser = defaultUser;
    emit();
}

function upvote(id) {
    currentUser.votes[id] = 1;
    emit();
}

function downvote(id) {
    currentUser.votes[id] = -1;
    emit();
}

function removeVote(id) {
    delete currentUser.votes[id];
    emit();
}

exports['default'] = {
    getUser: getUser,
    listen: function listen(cb) {
        return emitter.addListener('user-updated', cb);
    },
    login: login,
    logout: logout,
    upvote: upvote,
    downvote: downvote,
    removeVote: removeVote
};
module.exports = exports['default'];

},{"eventemitter3":4}],3:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactUpvote = require('react-upvote');

var _reactUpvote2 = _interopRequireDefault(_reactUpvote);

var _UserAPI = require('./UserAPI');

var _UserAPI2 = _interopRequireDefault(_UserAPI);

var _PostsAPI = require('./PostsAPI');

var _PostsAPI2 = _interopRequireDefault(_PostsAPI);

var App = _react2['default'].createClass({
    displayName: 'App',

    getInitialState: function getInitialState() {
        _PostsAPI2['default'].listen(this.updatePosts);
        _UserAPI2['default'].listen(this.updateUser);

        return {
            user: _UserAPI2['default'].getUser(),
            posts: _PostsAPI2['default'].getPosts(),
            errorMessage: ''
        };
    },

    updatePosts: function updatePosts(postsData) {
        this.setState({
            posts: postsData
        });
    },

    updateUser: function updateUser(userData) {
        this.setState({
            user: userData,
            errorMessage: ''
        });
    },

    errorMessage: function errorMessage(message) {
        this.setState({
            errorMessage: message
        });
    },

    toggleLogin: function toggleLogin(e) {
        e.preventDefault();
        return this.state.user.isLoggedIn ? _UserAPI2['default'].logout() : _UserAPI2['default'].login();
    },

    upvotePost: function upvotePost(id) {
        _PostsAPI2['default'].upvote(id);
        _UserAPI2['default'].upvote(id);
    },

    downvotePost: function downvotePost(id) {
        _PostsAPI2['default'].downvote(id);
        _UserAPI2['default'].downvote(id);
    },

    removeVote: function removeVote(id) {
        var currentVoteStatus = this.state.user.votes[id];

        _UserAPI2['default'].removeVote(id);

        if (currentVoteStatus === 1) {
            // remove upvote
            _PostsAPI2['default'].downvote(id);
        } else {
            // remove downvote
            _PostsAPI2['default'].upvote(id);
        }
    },

    render: function render() {
        var _this = this;

        var user = this.state.user;
        var isLoggedIn = user.isLoggedIn;

        var posts = this.state.posts.map(function (postData, i) {
            return _react2['default'].createElement(
                'article',
                { className: 'post', key: i },
                _react2['default'].createElement(_reactUpvote2['default'], {
                    voteStatus: user.votes[postData.id] || 0,
                    afterContent: _react2['default'].createElement(
                        'span',
                        { className: 'upvote-count' },
                        postData.upvotes
                    ),
                    upvoteContent: _react2['default'].createElement('i', { className: 'upvote-icon fa fa-arrow-up' }),
                    downvoteContent: _react2['default'].createElement('i', { className: 'downvote-icon fa fa-arrow-down' }),
                    shouldAllow: function () {
                        return isLoggedIn;
                    },
                    onDisallowed: function () {
                        return _this.errorMessage('You have to log in!');
                    },
                    onUpvote: function () {
                        return _this.upvotePost(postData.id);
                    },
                    onDownvote: function () {
                        return _this.downvotePost(postData.id);
                    },
                    onRemoveVote: function () {
                        return _this.removeVote(postData.id);
                    }
                }),
                _react2['default'].createElement(
                    'h2',
                    null,
                    postData.title
                )
            );
        });

        return _react2['default'].createElement(
            'main',
            { className: 'posts' },
            _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(
                    'a',
                    { href: '#', onClick: this.toggleLogin },
                    isLoggedIn ? 'logout' : 'login'
                )
            ),
            posts,
            _react2['default'].createElement(
                'div',
                { className: 'error' },
                this.state.errorMessage
            )
        );
    }
});

_react2['default'].render(_react2['default'].createElement(App, null), document.getElementById('app'));

},{"./PostsAPI":1,"./UserAPI":2,"react":undefined,"react-upvote":undefined}],4:[function(require,module,exports){
'use strict';

//
// We store our EE objects in a plain object whose properties are event names.
// If `Object.create(null)` is not supported we prefix the event names with a
// `~` to make sure that the built-in object properties are not overridden or
// used as an attack vector.
// We also assume that `Object.create(null)` is available when the event name
// is an ES6 Symbol.
//
var prefix = typeof Object.create !== 'function' ? '~' : false;

/**
 * Representation of a single EventEmitter function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @param {Boolean} once Only emit once
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() { /* Nothing to set */ }

/**
 * Holds the assigned EventEmitters by name.
 *
 * @type {Object}
 * @private
 */
EventEmitter.prototype._events = undefined;

/**
 * Return a list of assigned event listeners.
 *
 * @param {String} event The events that should be listed.
 * @param {Boolean} exists We only need to know if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events && this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Emit an event to all registered event listeners.
 *
 * @param {String} event The name of the event.
 * @returns {Boolean} Indication if we've emitted an event.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if ('function' === typeof listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Remove event listeners.
 *
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @param {Mixed} context Only remove listeners matching this context.
 * @param {Boolean} once Only remove once listeners.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return this;

  var listeners = this._events[evt]
    , events = [];

  if (fn) {
    if (listeners.fn) {
      if (
           listeners.fn !== fn
        || (once && !listeners.once)
        || (context && listeners.context !== context)
      ) {
        events.push(listeners);
      }
    } else {
      for (var i = 0, length = listeners.length; i < length; i++) {
        if (
             listeners[i].fn !== fn
          || (once && !listeners[i].once)
          || (context && listeners[i].context !== context)
        ) {
          events.push(listeners[i]);
        }
      }
    }
  }

  //
  // Reset the array, or remove it completely if we have no more listeners.
  //
  if (events.length) {
    this._events[evt] = events.length === 1 ? events[0] : events;
  } else {
    delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners or only the listeners for the specified event.
 *
 * @param {String} event The event want to remove all listeners for.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  if (!this._events) return this;

  if (event) delete this._events[prefix ? prefix + event : event];
  else this._events = prefix ? {} : Object.create(null);

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}]},{},[3]);
