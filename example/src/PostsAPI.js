'use strict';

import EventEmitter from 'eventemitter3';

let emitter = new EventEmitter();

let posts = {};

// generate set of posts with random upvotes
for (let i = 1; i <= 3; i++) {
    posts[i] = {
        title: 'Post #' + i,
        upvotes: Math.floor(Math.random() * 10)
    };
}

function getPosts() {
    return Object.keys(posts).map((id) => ({
        id: id,
        title: posts[id].title,
        upvotes: posts[id].upvotes
    }));
}

function emit(cb) {
    emitter.emit('posts-updated', getPosts());
    if (cb) {
        cb();
    }
}

function upvote(id, cb) {
    posts[id].upvotes += 1;
    emit(cb);
}

function downvote(id, cb) {
    posts[id].upvotes -= 1;
    emit(cb);
}

const Posts = {
    getPosts: getPosts,
    listen: (cb) => emitter.addListener('posts-updated', cb),
    upvote: upvote,
    downvote: downvote
};

export default Posts;
