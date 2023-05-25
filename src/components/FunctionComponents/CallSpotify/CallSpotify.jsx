import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

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

        <div className="text-center">
            {/* I might want to wrap this input in a form */}
            <input 
                className="border"
                placeholder='artist' 
                type="text" 
                value={input}
                onChange={(event) => setInput(event.target.value)}
                />
            <button className="border rounded-full" onClick={handleClick}>Search</button>
        </div>
    )    
}
export default CallSpotify;