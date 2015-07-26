'use strict';

import React from 'react/addons';

import cx from 'classnames';

let noop = () => {};

class Upvote extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            updating: false,
            voteStatus: props.voteStatus
        };
    }

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
    }

    allowed() {
        let { shouldAllow } = this.props;
        let onDisallowed = this.props.onDisallowed || noop;

        // allowed is the return value of shouldAllow() or true
        let allowed = shouldAllow ? shouldAllow() : true;

        // TODO: TEST THIS
        return allowed || (onDisallowed() && false);
    }

    vote(nextStatus) {
        let {
            updating,
            voteStatus
        } = this.state;

        let {
            onUpvote,
            onDownvote,
            onRemoveVote
        } = this.props;

        if (updating || !this.allowed()) {
            return;
        }

        let prevStatus = voteStatus;

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
    }

    render() {
        let {
            voteStatus,
            updating
        } = this.state;

        let {
            className,
            upvoteContent,
            downvoteContent,
            beforeContent,
            afterContent
        } = this.props;

        let upvoteCx = cx(className, {
            'upvoted': voteStatus === 1,
            'downvoted': voteStatus === -1,
            'updating': updating
        });

        let upvote = upvoteContent && (
            <div className="upvote" onClick={ () => this.vote(1) }>
                { upvoteContent }
            </div>
        );

        let downvote = downvoteContent && (
            <div className="downvote" onClick={ () => this.vote(-1) }>
                { downvoteContent }
            </div>
        );

        return (
            <div className={ upvoteCx }>

                { beforeContent }

                <div className={ `${className}-buttons` }>
                    { upvote }
                    { downvote }
                </div>

                { afterContent }

            </div>
        );
    }
}

Upvote.propTypes = {
    className: React.PropTypes.string,

    voteStatus: React.PropTypes.number,
    upvoteCount: React.PropTypes.number,

    shouldAllow: React.PropTypes.func,
    onDisallowed: React.PropTypes.func,

    onUpvote: React.PropTypes.func,
    onDownvote: React.PropTypes.func,
    onRemoveVote: React.PropTypes.func,

    upvoteContent: React.PropTypes.element,
    downvoteContent: React.PropTypes.element,
    beforeContent: React.PropTypes.element,
    afterContent: React.PropTypes.element
};

Upvote.defaultProps = {
    className: 'react-upvote',

    voteStatus: 0,
    upvoteCount: 0,

    shouldAllow: null,
    onDisallowed: null,

    onUpvote: null,
    onDownvote: null,
    onRemoveVote: null,

    upvoteContent: null,
    downvoteContent: null,
    beforeContent: null,
    afterContent: null
};

export default Upvote;
