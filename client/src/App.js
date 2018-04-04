import React, { Component } from 'react';
import Moment from 'react-moment';
import './App.css';
import './css/style.css';

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
      prevSongs: []
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
        this.setState({
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

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState.nowPlaying[0].id);
    // console.log(prevState);
    // console.log(prevState === this.state.nowPlaying)

    console.log(this.state.prevSongs)

    if (prevState.nowPlaying[0].id !== this.state.nowPlaying[this.state.nowPlaying.length-1].id) {
      this.setState({
        ...this.state,
        prevSongs: this.state.prevSongs.concat(this.state.nowPlaying)
      })

      console.log(this.state.nowPlaying[0].id);
    }
  }

  render() {
    const {nowPlaying} = this.state;
    // console.log(nowPlaying)
    // console.log(nowPlaying.length)
    const current = nowPlaying[nowPlaying.length - 1];
    // if (current !== nowPlaying) {
    //   this.setState({
    //     nowPlaying: [...nowPlaying, current]
    //   })
    // }

    // console.log(nowPlaying);

    const songList = this.state.prevSongs.reverse();
    console.log(songList);

    return (
      <div className="App">
        <div className='header-bar'>
          <a id='login' className='button' href='http://localhost:8888' > Login to Spotify </a>
        </div>
        <div className="song-info">
          <div className='album-art'>
            <img src={current.albumArt} alt={current.albumName} style={{ height: 300 }} />
          </div>
          <div className='song-details'>
            <p>Now Playing:</p> 
            <p className='song-name'>{current.name}</p>
            <p className='song-artist'>by <a className='artist-link' href={current.artistLink} target='_blank'>{current.artist}</a></p>
            <p className='song-album'>on <a className='album-link' href={current.albumLink} target='_blank'>{current.albumName}</a></p>
            <p className='album-release'>
              <Moment format='MMMM D, YYYY'>
                {current.albumReleaseDate}
              </Moment>
            </p>
            <p>Duration: {this.millisToMinutesAndSeconds(current.duration)}</p>
          </div>
        </div>

        <div className='history-list'>
          {
            this.state.prevSongs.map((song, i) => {
              return (
                (song.name !== current.name) ? 
                  <div className='song-info' key={i}>
                    <div className='album-art'>
                      <img src={song.albumArt} alt={current.albumName} style={{ height: 300 }} />
                    </div>
                    <div className='song-details'>
                      <p className='song-name'>{song.name}</p>
                      <p className='song-artist'>by <a className='artist-link' href={song.artistLink}>{song.artist}</a></p>
                      <p className='song-album'>on <a className='album-link' href={song.albumLink}>{song.albumName}</a></p>
                      <p className='album-release'>
                        <Moment format='MMMM D, YYYY'>
                          {song.albumReleaseDate}
                        </Moment>
                      </p>
                      <p>Duration: {this.millisToMinutesAndSeconds(song.duration)}</p>
                    </div>
                  </div>
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
