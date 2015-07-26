'use strict';

import EventEmitter from 'eventemitter3';

let emitter = new EventEmitter();

let defaultUser = {
    id: 0,
    isLoggedIn: false,
    votes: {}
};

let user = {
    id: 1,
    isLoggedIn: true,
    votes: {}
};

let currentUser = defaultUser;

function getUser() {
    return currentUser;
}

function emit(cb) {
    emitter.emit('user-updated', getUser());
    if (cb) {
        cb();
    }
}

function login(cb) {
    currentUser = user;
    emit(cb);
}

function logout(cb) {
    currentUser = defaultUser;
    emit(cb);
}

function upvote(id, cb) {
    currentUser.votes[id] = 1;
    emit(cb);
}

function downvote(id, cb) {
    currentUser.votes[id] = -1;
    emit(cb);
}

function removeVote(id, cb) {
    delete currentUser.votes[id];
    emit(cb);
}

export default {
    getUser: getUser,
    listen: (cb) => emitter.addListener('user-updated', cb),
    login: login,
    logout: logout,
    upvote: upvote,
    downvote: downvote,
    removeVote: removeVote
};
