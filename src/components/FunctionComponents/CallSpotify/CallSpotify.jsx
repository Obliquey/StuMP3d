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

    return (
        <div className="flex flex-col place-content-center space-y-4">
            <button className="border-inherit rounded-full p-2 bg-play bg-purple-600 bg-cover bg-no-repeat bg-center text-slate-300 font-semibold w-72 h-72 order-1 self-center shadow-black shadow-md hover:shadow-purple-600" onClick={handleClick}></button>
            <div className="text-center order-2">
                {/* I might want to wrap this input in a form */}
                <input 
                    className="border-2 border-black text-center pt-2 pb-2 text-lg tracking-widest bg-slate-100 text-black overflow-visible"
                    placeholder='artist' 
                    type="text" 
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    />
            </div>
        </div>
    )    
}
export default CallSpotify;