import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";

function CallSpotify() {
    const [input, setInput] = useState('');
    const dispatch = useDispatch();

    // upon button click, take the artist the user gave as input and send it to the saga for proccessing.
    // Will need this to also include conditional rendering of the embedded song.
    const handleClick = () => {
        dispatch({
            type: 'CALL_SPOTIFY',
            payload: input
        })
        // will want to conditionally clear this when a song starts playing?
        setInput('');
    }

    return (

        <>
            <input 
                placeholder='artist' 
                type="text" 
                value={input}
                onChange={(event) => setInput(event.target.value)}
                />
            <button onClick={handleClick}>Search</button>
            <a href="http://localhost:5000/api/spotifyOAuth/login">LOGIN TO SPOTIFY</a>
        </>
    )    
}
export default CallSpotify;