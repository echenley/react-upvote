# react-upvote

**Note: This is a very new project not ready for production use. It's API will change frequently until v1.0.0.**

Reusable upvote component for React applications.


## Todo

- Thorough testing

## Demo & Examples

Live demo: [echenley.github.io/react-upvote](http://echenley.github.io/react-upvote/)

To build the examples locally, run:

```
npm install
npm start
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use react-upvote is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/react-upvote.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-upvote --save
```


## Usage

```
var Upvote = require('react-upvote');

<Upvote>Example</Upvote>
```


### Properties

| Property | Type | Default Value | Description |
| -------- | ---- | ------------- | ----------- |
| className | String | `'react-upvote'` | Class given to the upvote container |
| voteStatus | Integer | `0` | Current user's vote status. Can be `-1` (downvoted) `0` (no vote) or `1` (upvoted) |
| upvoteCount | Integer | `0` | The component's current upvote count |
| shouldAllow | Function | `null` | Function returning a boolean which determines whether to allow the current user to vote. |
| onDisallowed | Function | `null` | Function called when `shouldAllow` returns `false` |
| onUpvote | Function | `null` | Function called when an upvote is registered |
| onDownvote | Function | `null` | Function called when a downvote is registered |
| onRemoveVote | Function | `null` | Function called when undoing a previous vote |
| upvoteContent | Component | `<div className="upvote">^</div>` |
| downvoteContent | Component | `<div className="downvote">v</div>` |


## Development (`src`, `lib` and the build process)

**NOTE:** The source code for the component is in `src`. A transpiled CommonJS version (generated with Babel) is available in `lib` for use with node.js, browserify and webpack. A UMD bundle is also built to `dist`, which can be included without the need for any build system.

To build, watch and serve the examples (which will also watch the component source), run `npm start`. If you just want to watch changes to `src` and rebuild `lib`, run `npm run watch` (this is useful if you are working with `npm link`).


## License

MIT Licensed. Copyright (c) Evan Henley 2015.
