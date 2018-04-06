import React, { Component } from 'react';
import './App.css';
import './css/style.css';
import Song from './components/Song.js';

import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {faUserCircle} from '@fortawesome/fontawesome-free-regular';

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
      user: [{
        name: '',
        email: '',
        id: ''
      }],
      nowPlaying: [{ 
        name: 'Not Checked', 
        id: null,
        duration: '', 
        artist: '', 
        artistLink: '', 
        albumName: '',
        albumLink: '',
        albumReleaseDate: '',
        albumArt: ''
      }],
      prevSongs: [],
      didUpdate: false
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

  getCurrentUser() {
    spotifyApi.getMe()
      .then((res) => {
        console.log(res);
        this.setState({
          ...this.state,
          user: [{
            name: res.display_name,
            email: res.email,
            id: res.id
          }]
        })
      })
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        console.log(response)
        this.setState({
          ...this.state,
          nowPlaying: [{ 
              id: response.item.id,
              name: response.item.name,
              duration: response.item.duration_ms,
              artist: response.item.artists[0].name,
              artistLink: response.item.artists[0].external_urls.spotify, 
              albumName: response.item.album.name,
              albumLink: response.item.album.external_urls.spotify,
              albumReleaseDate: response.item.album.release_date,
              albumArt: response.item.album.images[0].url
            }]
        });
      })
  }

  millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  componentDidMount() {
    this.getCurrentUser();
    this.getNowPlaying();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.nowPlaying[0].id !== this.state.nowPlaying[this.state.nowPlaying.length-1].id) {
            
      this.setState({
        ...this.state,
        prevSongs: this.state.prevSongs.concat(this.state.nowPlaying)
      })
    }
  }

  render() {
    const {nowPlaying} = this.state;
    const current = nowPlaying[nowPlaying.length - 1];
    
    const name = this.state.user[0].name ? this.state.user[0].name : this.state.user[0].id;

    return (
      <div className="App">
        <div className='header-bar'>
          {!this.state.loggedIn ? 
          <a id='login' className='button' href='http://localhost:8888' > Login to Spotify </a> :
            [<FontAwesomeIcon icon={faUserCircle} />, " ", name]
          }
        </div>
        
        <div>
          {
            this.state.loggedIn ?
              <Song details={this.state.nowPlaying[0]} duration={this.millisToMinutesAndSeconds} />
              : <div className='not-logged-in'>No user currently logged in. <a href='http://localhost:8888'>Log in</a> to check Now Playing.</div>
          }
        </div>

        {/* <Song details={song} duration={this.millisToMinutesAndSeconds} /> */}

        <div className='history-list'>
          {
            this.state.prevSongs.map((song, i) => {
              return (
                (song.name !== current.name) ? 
                  <Song key={i} details={song} duration={this.millisToMinutesAndSeconds} />
                : ''
              )
          })}
        </div>

        <div className='footer-bar'>
          {this.state.loggedIn &&
            <button id='now-playing' className='button' onClick={() => this.getNowPlaying()}>
              Check Now Playing
          </button>
          }
        </div>
      </div>
    );
  }
}

export default App;
