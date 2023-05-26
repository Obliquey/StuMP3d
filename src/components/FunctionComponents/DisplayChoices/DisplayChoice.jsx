import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function DisplayChoices(props) {
    console.log("Here's our props:", props);
    console.log("Here's our correct song:", props.correctSong);
    const dispatch = useDispatch();
    
    const handleChoice = (song) => {
        if(song === props.correctSong.name) {
            // If the user's choice is correct, I will need to send a dispatch with their chosen song and a 'true' value, that they correctly guessed it.
            // Then, I will need to put the correct song, + all the album info, into a reducer for use in the recap page
            // Then, I will need to use history.push to go to the recap page
            dispatch({
                type: 'CORRECTLY_GUESSED',
                payload: props.correctSong
            })
            console.log("Good job! You were correct in your guess!:", props.correctSong);
        } else {
            // If the user is incorrect, I will need to do basically the same thing EXCEPT a boolean value of 'false'.
            dispatch({
                type: 'INCORRECTLY_GUESSED',
                payload: props.correctSong
            })
            console.log("Try again!");
        }
    }

    return (
        <>
            {
                props.songs.map(song => {
                    return (
                        <button 
                            className="border rounded-full p-2 bg-purple-700 m-2 text-white font-medium"
                            onClick={() => handleChoice(song.name)}
                        >
                              
                                {song.name}

                        </button>
                    )
                })
            }
        </>
    )
}
export default DisplayChoices;