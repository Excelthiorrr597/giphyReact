// es5 and 6 polyfills, powered by babel
require("babel-polyfill")

// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
require("isomorphic-fetch")

// universal utils: cache, fetch, store, resource, fetcher, router
// import {cache, fetch, store, resource, router} from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed file to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
if (module.hot) {
    module.hot.accept()
}

// import {React, Component, DOM, Resolver, resolve} from 'react-resolver'
import ReactDOM from 'react-dom'
import React, {Component} from 'react'

let $ = require('jquery')

var ajaxParams = {
    url: 'http://api.giphy.com/v1/gifs/search',
    data: {
        q: 'south park',
        api_key: 'dc6zaTOxFJmzC'
    }
}

var GifsView = React.createClass({

    getInitialState: () => {
        return {
            focusId: (location.hash.slice(1) || null)
        }
    },

    _getSingleGif: function(gif) {
        return <SingleGif key={gif.id} focusId={this.state.focusId} walkieTalkie={this._walkieTalkie} gif={gif} />
    },

    _handleClick: function() {
        if (this.state.focusId) {
            location.hash=''
            this.setState({
                focusId:null
            })
        }
    },

    _walkieTalkie: function(gifId) {
        this.setState({
            focusId: gifId
        })
    },

    render: function() {
        var gifs = this.props.gifs
        return (
            <div id="gifsContainer" onClick={this._handleClick} >
                {gifs.map(this._getSingleGif)}
            </div>
            )
    }
})

var SingleGif = React.createClass({

    _handleClick: function() {
        var walkieTalkie = this.props.walkieTalkie,
            gifId = this.props.gif.id
        location.hash = gifId
        walkieTalkie(gifId)
    },

    render: function() {
        var gif = this.props.gif,
            gifId = gif.id,
            focusId = this.props.focusId,
            imgUrl = gif.images.downsized.url,
            styleObj = {
                display:'none'
            },
            styleObj2 = {
                position:'fixed',
                left:'50%',
                top:'50%',
                transform:'translate(-50%,-50%)',
                width:'50%'
            }

        if (focusId===gifId || location.hash.slice(1)===gifId) {
            styleObj = {
                position:'fixed',
                left:'0',
                top:'0',
                right:'0',
                bottom:'0',
                backgroundColor:'rgba(0,0,0,0.8)',
            }
        }

        console.log(location.hash)
        return (
            <div className="singleGif" onClick={this._handleClick}>
                <div style={styleObj} >
                    <img src={imgUrl} style={styleObj2} />
                </div>
                <img src={imgUrl} />
                <GifDetails details={gif} />
            </div>
            )
    }
})

var GifDetails = React.createClass({

    _getDate: function() {
        var d = new Date(this.props.details.import_datetime)
        return d.toString().split(" ").slice(0,4).join(" ")
    },

    render: function() {
        var rating = this.props.details.rating,
            postedDate = this._getDate()

        return (
            <div className="details">
                <p>Rating: {rating}</p>
                <p>{postedDate}</p>
            </div>
            )
    }
})

$.ajax(ajaxParams).then((response)=>{
    ReactDOM.render(<GifsView gifs={response.data} />, document.querySelector('#container'))
})
