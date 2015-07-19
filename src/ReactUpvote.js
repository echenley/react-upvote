'use strict';

import React from 'react/addons';

import cx from 'classnames';

let noop = () => {};

const Upvote = React.createClass({

    propTypes: {
        className: React.PropTypes.string,

        voteStatus: React.PropTypes.number,

        shouldAllow: React.PropTypes.func,
        onDisallowed: React.PropTypes.func,

        onUpvote: React.PropTypes.func,
        onDownvote: React.PropTypes.func,
        onRemoveVote: React.PropTypes.func,

        upvoteContent: React.PropTypes.element,
        downvoteContent: React.PropTypes.element,
        beforeContent: React.PropTypes.element,
        afterContent: React.PropTypes.element
    },

    getDefaultProps() {
        return {
            className: 'react-upvote',

            voteStatus: 0,
            upvoteCount: 0,

            shouldAllow: () => true,
            onDisallowed: noop,

            onUpvote: noop,
            onDownvote: noop,
            onRemoveVote: noop,

            upvoteContent: null,
            downvoteContent: null
        };
    },

    getInitialState() {
        return {
            updating: false,
            voteStatus: this.props.voteStatus
        };
    },

    componentWillReceiveProps(nextProps) {
        let oldVoteStatus = this.props.voteStatus;
        let newVoteStatus = nextProps.voteStatus;

        // don't update unless post's vote status changes
        if (oldVoteStatus === newVoteStatus) {
            return;
        }

        this.setState({
            updating: false,
            voteStatus: nextProps.voteStatus
        });
    },

    shouldAllow() {
        let shouldAllow = this.props.shouldAllow;

        if (shouldAllow && !shouldAllow()) {
            this.props.onDisallowed();
            return false;
        }

        return true;
    },

    vote(nextStatus) {
        if (this.state.updating || !this.shouldAllow()) {
            return;
        }

        let prevStatus = this.state.voteStatus;

        if (prevStatus === nextStatus) {
            // toggle current vote off
            this.props.onRemoveVote();
            nextStatus = 0;
        } else {
            // add/change vote

            if (prevStatus !== 0 && nextStatus !== 0) {
                // remove previous vote first
                this.props.onRemoveVote();
            }

            // add new vote
            if (nextStatus === 1) {
                this.props.onUpvote();
            } else {
                this.props.onDownvote();
            }
        }

        this.setState({
            // update voteStatus
            voteStatus: nextStatus,
            // wait for action to complete before allowing upvote
            updating: true
        });
    },

    render() {
        let voteStatus = this.state.voteStatus;

        let upvoteCx = cx(this.props.className, {
            'upvoted': voteStatus === 1,
            'downvoted': voteStatus === -1,
            'updating': this.state.updating
        });

        let upvoteContent = this.props.upvoteContent;
        let downvoteContent = this.props.downvoteContent;

        let beforeContent = this.props.beforeContent || null;
        let afterContent = this.props.afterContent || null;

        return (
            <div className={ upvoteCx }>
                { beforeContent }
                <div className="react-upvote-icons">
                    { upvoteContent && (
                        <div className="upvote" onClick={ () => this.vote(1) }>
                            { upvoteContent }
                        </div>
                    )}
                    { downvoteContent && (
                        <div className="downvote" onClick={ () => this.vote(-1) }>
                            { downvoteContent }
                        </div>
                    )}
                </div>
                { afterContent }
            </div>
        );
    }

});

export default Upvote;
