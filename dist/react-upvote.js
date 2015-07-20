(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ReactUpvote = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var noop = function noop() {};

var Upvote = _reactAddons2['default'].createClass({
    displayName: 'Upvote',

    propTypes: {
        className: _reactAddons2['default'].PropTypes.string,

        voteStatus: _reactAddons2['default'].PropTypes.number,

        shouldAllow: _reactAddons2['default'].PropTypes.func,
        onDisallowed: _reactAddons2['default'].PropTypes.func,

        onUpvote: _reactAddons2['default'].PropTypes.func,
        onDownvote: _reactAddons2['default'].PropTypes.func,
        onRemoveVote: _reactAddons2['default'].PropTypes.func,

        upvoteContent: _reactAddons2['default'].PropTypes.element,
        downvoteContent: _reactAddons2['default'].PropTypes.element,
        beforeContent: _reactAddons2['default'].PropTypes.element,
        afterContent: _reactAddons2['default'].PropTypes.element
    },

    getDefaultProps: function getDefaultProps() {
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

    getInitialState: function getInitialState() {
        return {
            updating: false,
            voteStatus: this.props.voteStatus
        };
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var oldVoteStatus = this.props.voteStatus;
        var newVoteStatus = nextProps.voteStatus;

        // don't update unless post's vote status changes
        if (oldVoteStatus === newVoteStatus) {
            return;
        }

        this.setState({
            updating: false,
            voteStatus: nextProps.voteStatus
        });
    },

    allowed: function allowed() {
        var shouldAllow = this.props.shouldAllow;
        var onDisallowed = this.props.onDisallowed || noop;

        if (shouldAllow && !shouldAllow()) {
            onDisallowed();
            return false;
        }

        return true;
    },

    vote: function vote(nextStatus) {
        if (this.state.updating || !this.allowed()) {
            return;
        }

        var prevStatus = this.state.voteStatus;
        var onUpvote = this.props.onUpvote || noop;
        var onDownvote = this.props.onDownvote || noop;
        var onRemoveVote = this.props.onRemoveVote || noop;

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

    render: function render() {
        var _this = this;

        var voteStatus = this.state.voteStatus;

        var upvoteCx = (0, _classnames2['default'])(this.props.className, {
            'upvoted': voteStatus === 1,
            'downvoted': voteStatus === -1,
            'updating': this.state.updating
        });

        var upvoteContent = this.props.upvoteContent || _reactAddons2['default'].createElement(
            'div',
            { className: 'upvote' },
            '^'
        );
        var downvoteContent = this.props.downvoteContent || _reactAddons2['default'].createElement(
            'div',
            { className: 'downvote' },
            'v'
        );

        var beforeContent = this.props.beforeContent || null;
        var afterContent = this.props.afterContent || null;

        return _reactAddons2['default'].createElement(
            'div',
            { className: upvoteCx },
            beforeContent,
            _reactAddons2['default'].createElement(
                'div',
                { className: 'react-upvote-icons' },
                upvoteContent && _reactAddons2['default'].createElement(
                    'div',
                    { className: 'upvote', onClick: function () {
                            return _this.vote(1);
                        } },
                    upvoteContent
                ),
                downvoteContent && _reactAddons2['default'].createElement(
                    'div',
                    { className: 'downvote', onClick: function () {
                            return _this.vote(-1);
                        } },
                    downvoteContent
                )
            ),
            afterContent
        );
    }

});

exports['default'] = Upvote;
module.exports = exports['default'];

},{"classnames":undefined,"react/addons":undefined}]},{},[1])(1)
});