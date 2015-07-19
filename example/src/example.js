'use strict';

import React from 'react';
import Upvote from 'react-upvote';

import UserAPI from './UserAPI';
import PostsAPI from './PostsAPI';

const App = React.createClass({
    getInitialState() {
        PostsAPI.listen(this.updatePosts);
        UserAPI.listen(this.updateUser);

        return {
            user: UserAPI.getUser(),
            posts: PostsAPI.getPosts(),
            errorMessage: ''
        };
    },

    updatePosts(postsData) {
        this.setState({
            posts: postsData
        });
    },

    updateUser(userData) {
        this.setState({
            user: userData,
            errorMessage: ''
        });
    },

    errorMessage(message) {
        this.setState({
            errorMessage: message
        });
    },

    toggleLogin(e) {
        e.preventDefault();
        return this.state.user.isLoggedIn
            ? UserAPI.logout()
            : UserAPI.login();
    },

    upvotePost(id) {
        PostsAPI.upvote(id);
        UserAPI.upvote(id);
    },

    downvotePost(id) {
        PostsAPI.downvote(id);
        UserAPI.downvote(id);
    },

    removeVote(id) {
        let currentVoteStatus = this.state.user.votes[id];

        UserAPI.removeVote(id);

        if (currentVoteStatus === 1) {
            // remove upvote
            PostsAPI.downvote(id);
        } else {
            // remove downvote
            PostsAPI.upvote(id);
        }
    },

    render() {
        let user = this.state.user;
        let isLoggedIn = user.isLoggedIn;

        let posts = this.state.posts.map((postData, i) => (
            <article className="post" key={ i }>
                <Upvote
                    voteStatus={ user.votes[postData.id] || 0 }
                    afterContent={ <span className="upvote-count">{ postData.upvotes }</span> }
                    upvoteContent={ <i className="upvote-icon fa fa-arrow-up"></i> }
                    downvoteContent={ <i className="downvote-icon fa fa-arrow-down"></i> }
                    shouldAllow={ () => isLoggedIn }
                    onDisallowed={ () => this.errorMessage('You have to log in!') }
                    onUpvote={ () => this.upvotePost(postData.id) }
                    onDownvote={ () => this.downvotePost(postData.id) }
                    onRemoveVote={ () => this.removeVote(postData.id) }
                />
                <h2>{ postData.title }</h2>
            </article>
        ));

        return (
            <main className="posts">
                <div>
                    <a href="#" onClick={ this.toggleLogin }>
                        { isLoggedIn ? 'logout' : 'login' }
                    </a>
                </div>
                { posts }
                <div className="error">{ this.state.errorMessage }</div>
            </main>
        );
    }
});

React.render(<App />, document.getElementById('app'));
