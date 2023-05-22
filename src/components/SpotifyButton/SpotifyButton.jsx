import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

function CallSpotify() {
    const [input, setInput] = useState('');
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch({
            type: 'CALL_SPOTIFY',
            payload: input
        })
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
        </>
    )    
}
export default CallSpotify;