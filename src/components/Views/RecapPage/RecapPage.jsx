import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

function RecapPage() {
    const guess = useSelector(store => store.guess)
    const albumInfo = useSelector(store => store.spotify.albumInfo)
    const history = useHistory();
    const dispatch = useDispatch();


    const coverArt = albumInfo.coverArt[1].url;
    const albumName = albumInfo.albumName;
    const releaseDate = albumInfo.releaseDate;

    // need to write a function that goes back to the play Page but also clears the current song content.
    const handleClick = () => {
        dispatch({
            type: 'EMPTY_PREVIEWS',
            payload: []
        });
        dispatch({
            type: 'EMPTY_ALBUM',
            payload: []
        })
        dispatch({
            type: 'CLEAR_SONGS_ARRIVED',
            payload: 'false'
        })
        history.push('/playPage');
    }

    //  function to return congrats or nice try
    const returnCongrats = () => {
        if(guess.guess === 'true') {
            return <p className="text-3xl mb-3 text-white animate-bounce">Good job!</p>
        } else {
            return <p className="text-3xl mb-3 text-white animate-pulse">Try Again!</p>
        }
    }

    return(
        <div className="text-center mt-20">
            <p>
                   {
                    returnCongrats()
                   }
            </p>
            <div>
                <img src={coverArt} className="outline outline-white outline-offset-2 rounded-md"></img>
                <p className="text-gray-200 m-2">{guess.song.correctSong.name} - {albumName}</p>
                <p className="text-gray-200 m-2">{releaseDate}</p>
                <button className="border-inherit rounded-full p-2 mt-10 bg-purple-700 text-white" onClick={handleClick}>Play Again</button>
            </div>
        </div>
    )
}

export default RecapPage;