import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import CallSpotify from "../../FunctionComponents/CallSpotify/CallSpotify";
import DisplaySongs from "../../FunctionComponents/DisplaySongs/DisplaySongs";

// What does this page need to do? This page is going to be the play page, so it will have both the search + play button (probably another component)
// AND the conditional rendering of four choices. 
function PlayPage() {
    const [input, setInput] = useState('');
    const dispatch = useDispatch();
    const songsArrived = useSelector(store => store.spotify.songsArrived)
    const previews = useSelector(store => store.spotify.previews)

    const handleClick = () => {
        dispatch({
            type: 'CALL_SPOTIFY',
            payload: input
        })
        // will want to conditionally clear this when a song starts playing?
        setInput('');
    }
    if(songsArrived === 'true') {
        console.log("Previews:", previews);
    }


    return(
        <div className="text-center">
            {/* This is the search function */}
            {/* I might want to wrap this input in a form */}
            <input 
                className="border"
                placeholder='artist' 
                type="text" 
                value={input}
                onChange={(event) => setInput(event.target.value)}
                />
            <button className="border rounded-full" onClick={handleClick}>Search</button>

            {/* This is the song display */}
            {/* <DisplaySongs /> */}
        </div>

    )
}

export default PlayPage;