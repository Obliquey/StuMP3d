import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";

function DisplayChoices(props) {
    console.log("Here's our props:", props);
    console.log("Here's our correct song:", props.correctSong);

    const dispatch = useDispatch();
    const history = useHistory();
    const albumInfo = useSelector(store => store.spotify.albumInfo)
    
    const handleChoice = (songName) => {
        if(songName === props.correctSong.name) {
            // If the user's choice is correct, I will need to send a dispatch with their chosen song and a 'true' value, that they correctly guessed it.
            // Then, I will need to put the correct song, + all the album info, into a reducer for use in the recap page
            // Then, I will need to use history.push to go to the recap page
            dispatch({
                type: 'CORRECTLY_GUESSED',
                payload: {correctSong: props.correctSong, albumInfo: albumInfo, guess: true}
            });
            history.push('/recap');
        } else {
            // If the user is incorrect, I will need to do basically the same thing EXCEPT a boolean value of 'false'.
            dispatch({
                type: 'INCORRECTLY_GUESSED',
                payload: {correctSong: props.correctSong, guess:false}
            });
            history.push('/recap');
        }
    };

    return (
            <div className="grid grid-cols-1 w-auto m-auto">
                {
                    props.songs.map(song => {
                        //  * This is a final stop-gap fix for if we get less than 4 tracks. I can't always trust Spotify to give me the right info
                        if(song === undefined) {
                            return <p></p>
                        } else {
                        return (
                            <button 
                                className="border-inherit rounded-full p-2 bg-purple-700 m-2 text-white font-medium"
                                onClick={() => handleChoice(song.name)}
                                key={props.songs.indexOf(song)}
                            >
                                
                                    {song.name}

                            </button>
                        )
                        }
                    })
                }
            </div>
    )
}
export default DisplayChoices;