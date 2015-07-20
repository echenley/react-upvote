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

            shouldAllow: null,
            onDisallowed: null,

            onUpvote: null,
            onDownvote: null,
            onRemoveVote: null,

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

    allowed() {
        let shouldAllow = this.props.shouldAllow;
        let onDisallowed = this.props.onDisallowed || noop;

        if (shouldAllow && !shouldAllow()) {
            onDisallowed();
            return false;
        }

        return true;
    },

    vote(nextStatus) {
        if (this.state.updating || !this.allowed()) {
            return;
        }

        let prevStatus = this.state.voteStatus;
        let onUpvote = this.props.onUpvote || noop;
        let onDownvote = this.props.onDownvote || noop;
        let onRemoveVote = this.props.onRemoveVote || noop;

        if (prevStatus === nextStatus) {
            // undo current vote
            onRemoveVote();
            nextStatus = 0;
        } else {
            // add/change vote

            if (prevStatus !== 0 && nextStatus !== 0) {
                // undo previous vote first
                onRemoveVote();
            }

            // add new vote
            if (nextStatus === 1) {
                onUpvote();
            } else {
                onDownvote();
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

        let upvoteContent = this.props.upvoteContent || <div className="upvote">^</div>;
        let downvoteContent = this.props.downvoteContent || <div className="downvote">v</div>;

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
