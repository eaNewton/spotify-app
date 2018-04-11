import React from 'react';
import Moment from 'react-moment';
import { millisToMinutesAndSeconds } from '../javascripts/functions';

const Song = (props) => {
  return(
    <div className="song-info">
      <div className='album-art'>
        <img src={props.details.albumArt} alt={props.details.albumName} style={{ height: 300 }} />
      </div>
      <div className='song-details'>
        <p>Now Playing:</p>
        <p className='song-name'>{props.details.name}</p>
        <p className='song-artist'>by <a className='artist-link' href={props.details.artistLink} target='_blank'>{props.details.artist}</a></p>
        <p className='song-album'>on <a className='album-link' href={props.details.albumLink} target='_blank'>{props.details.albumName}</a></p>
        <p className='album-release'>
          <Moment format='MMMM D, YYYY'>
            {props.details.albumReleaseDate}
          </Moment>
        </p>
        <p>Duration: {millisToMinutesAndSeconds(props.details.duration)}</p>
      </div>
    </div>
  );
}

export default Song;
