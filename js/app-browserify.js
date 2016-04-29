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

let $ = require('jquery'),
    Backbone = require('backbone')

var ajaxParams = {
    url: 'http://api.giphy.com/v1/gifs/search',
    data: {
        q: 'funny dog',
        api_key: 'dc6zaTOxFJmzC'
    }
}

var GifsView = React.createClass({

    getInitialState: () => {
        return {
            focusId: null
        }
    },

    _getSingleGif: function(gif) {
        return <SingleGif key={gif.id} focusId={this.state.focusId} walkieTalkie={this._walkieTalkie} gif={gif} />
    },

    _search: function(event) {
        if (event.which === 13) {
            var query = event.target.value
            console.log(query)
            event.target.value = ''
            location.hash = `search/${query}`
        }
    },

    _walkieTalkie: function(gifId) {
        if (this.state.focusId === null) {
            this.setState({
                focusId: gifId
            })
        }
        else {
            this.setState({
                focusId:null
            })
        }
    },

    render: function() {
        var gifs = this.props.gifs
        return (
            <div id="page">
                <div id="searchContainer">
                    <input id="search" type='text' placeholder='Search for Gifs' onKeyPress={this._search} ref='searchQuery' />
                </div>
                <div id="gifsContainer">
                    {gifs.map(this._getSingleGif)}
                </div>
            </div>
            )
    }
})

var SingleGif = React.createClass({

    _handleClick: function() {
        console.log('click')
        var walkieTalkie = this.props.walkieTalkie,
            gifId = this.props.gif.id
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

        if (focusId===gifId) {
            styleObj = {
                position:'fixed',
                left:'0',
                top:'0',
                right:'0',
                bottom:'0',
                backgroundColor:'rgba(0,0,0,0.8)'
            }
        }

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

var GiphyRouter = Backbone.Router.extend({

    routes: {
        'search/:query':'showSearchView',
        'home':'showDefaultView'
    },

    showDefaultView: function() {
        var ajaxParams = {
            url: 'http://api.giphy.com/v1/gifs/search',
            data: {
                q: 'south park',
                api_key: 'dc6zaTOxFJmzC',
                limit:48
            }
        }
        $.ajax(ajaxParams).then((response)=>{
            ReactDOM.render(<GifsView gifs={response.data} />, document.querySelector('#container'))
        })
    },

    showSearchView: function(query) {
        var ajaxParams = {
            url: 'http://api.giphy.com/v1/gifs/search',
            data: {
                q: query,
                api_key: 'dc6zaTOxFJmzC',
                limit:48
            }
        }
        $.ajax(ajaxParams).then((response)=>{
            ReactDOM.render(<GifsView gifs={response.data} />, document.querySelector('#container'))
        })
    },

    initialize: function() {
        location.hash='home'
        Backbone.history.start()
    }
})

var gr = new GiphyRouter()
