import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

function RecapPage() {
    const guess = useSelector(store => store.guess)
    const albumInfo = useSelector(store => store.spotify.albumInfo)
    const history = useHistory();
    const dispatch = useDispatch();
    console.log('Guess:', guess.guess)


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
            return <p className="text-3xl mb-3">Good job!</p>
        } else {
            return <p className="text-3xl mb-3">Try Again!</p>
        }
    }

    return(
        <div className="text-center">
            <p>
                   {
                    returnCongrats()
                   }
            </p>
            <div>
                <img src={coverArt}></img>
                <p>{guess.song.correctSong.name} - {albumName}</p>
                <p>{releaseDate}</p>
                <button className="border-inherit rounded-full p-1 mt-10 bg-purple-700 text-white" onClick={handleClick}>Play Again</button>
            </div>
        </div>
    )
}

export default RecapPage;