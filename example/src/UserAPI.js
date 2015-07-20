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

export default {
    getUser: getUser,
    listen: (cb) => emitter.addListener('user-updated', cb),
    login: login,
    logout: logout,
    upvote: upvote,
    downvote: downvote,
    removeVote: removeVote
};
