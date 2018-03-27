import React, { Component } from 'react';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', artist: '', albumArt: '' }
    }
    this.millisToMinutesAndSeconds = this.millisToMinutesAndSeconds.bind(this);
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        console.log(response);
        this.setState({
          nowPlaying: { 
              name: response.item.name,
              duration: response.item.duration_ms,
              artist: response.item.artists[0].name,
              artistLink: response.item.artists[0].external_urls.spotify, 
              albumName: response.item.album.name,
              albumLink: response.item.album.external_urls.spotify,
              albumArt: response.item.album.images[0].url
            }
        });
      })
  }

  millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  render() {
    return (
      <div className="App">
        <a id='login' className='button' href='http://localhost:8888' > Login to Spotify </a>
        <div className="song-info">
          <div className='album-art'>
            <img src={this.state.nowPlaying.albumArt} style={{ height: 300 }} />
          </div>
          <div className='song-details'>
            <p>Now Playing:</p> 
            <p className='song-name'>{this.state.nowPlaying.name}</p>
            <p className='song-artist'>by <a className='artist-link' href={this.state.nowPlaying.artistLink} target='_blank'>{this.state.nowPlaying.artist}</a></p>
            <p>on <a href={this.state.nowPlaying.albumLink} target='_blank'>{this.state.nowPlaying.albumName}</a></p>
            <p>Duration: {this.millisToMinutesAndSeconds(this.state.nowPlaying.duration)}</p>
          </div>
        </div>
        {this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
      </div>
    );
  }
}

export default App;
