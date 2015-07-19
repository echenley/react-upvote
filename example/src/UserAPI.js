'use strict';

import EventEmitter from 'eventemitter3';

let emitter = new EventEmitter();

let user = {
    id: 1,
    isLoggedIn: false,
    votes: {}
};

function getUser() {
    return user;
}

function emit() {
    emitter.emit('user-updated', getUser());
}

function login() {
    user.isLoggedIn = true;
    emit();
}

function logout() {
    user.isLoggedIn = false;
    emit();
}

function upvote(id) {
    user.votes[id] = 1;
    emit();
}

function downvote(id) {
    user.votes[id] = -1;
    emit();
}

function removeVote(id) {
    delete user.votes[id];
    emit();
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
