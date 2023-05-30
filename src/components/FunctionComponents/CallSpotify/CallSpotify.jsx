import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

function CallSpotify() {
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

    return (

        <div className="text-center">
            {/* I might want to wrap this input in a form */}
            <input 
                className="border"
                placeholder='artist' 
                type="text" 
                value={input}
                onChange={(event) => setInput(event.target.value)}
                />
            <button className="border-inherit rounded-full p-2 bg-purple-700 text-white font-semibold" onClick={handleClick}>Search</button>
        </div>
    )    
}
export default CallSpotify;