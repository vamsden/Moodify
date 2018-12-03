class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTrack: null
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
              // You can now initialize Spotify.Player and use the SDK

            this.player = new Spotify.Player({
                name: 'HB Project',
                getOAuthToken: callback => {
                    // Run code to get a fresh access token
                    callback(this.props.accessToken);
                    },
                volume: 0.5
            });

            this.player.on('ready', async data => {
                let { device_id } = data;
                console.log("Let the music play on!");
                // set the deviceId variable, then let's try
                // to swap music playback to *our* player
            });

            this.player.addListener('player_state_changed', currentTrack => {
                this.setState({currentTrack: currentTrack});
                console.log(currentTrack)
            });

            this.player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID is not ready for playback', device_id);
            });

            this.player.connect().then(success => {
                if (success) {
                console.log('The Web Playback SDK successfully connected to Spotify!');
                }
            })
        }
    }

    play = ({
          spotify_uri,
          playerInstance: {
            _options: {
              getOAuthToken,
              id
            }
          }
        }) => {
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
                method: 'PUT',
                body: JSON.stringify({ uris: [spotify_uri] }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.accessToken}`
                },
            });
        }

    togglePlay = (e) => {
        this.player.togglePlay()
    }

    goToNextSong = (e) => {
        this.props.nextSong();
    }

    goToPreviousSong = (e) => {
        this.props.previousSong();
    }

    componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
        if (this.props.songToPlay !== prevProps.songToPlay) {
            this.play ({
                playerInstance: this.player,
                spotify_uri: this.props.songToPlay,
            });
        }
    }


    render() {

        let trackName = "Track";
            if (this.state.currentTrack) {
                trackName = this.state.currentTrack.track_window.current_track.name;
            }

        let artistName = "Artist";
            if (this.state.currentTrack) {
                // artistName = this.state.currentTrack.track_window.current_track.artists[0].name
                artists = this.state.currentTrack.track_window.current_track.artists
                artistName = artists.na
            }

        let albumArt = '';
            if (this.state.currentTrack) {
                albumArt = this.state.currentTrack.track_window.current_track.album.images[0].url;
            }

        return (<div>
            <div> {trackName} </div>
            <div> {artistName} </div>
            <img src={albumArt}></img>


            <button onClick={this.goToPreviousSong}> Previous </button>
            <button onClick={this.togglePlay}> Play </button>
            <button onClick={this.goToNextSong}> Next </button>

            </div>
        );
    }
}