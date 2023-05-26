import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

function RecapPage() {
    const guess = useSelector(store => store.guess.guess)
    const albumInfo = useSelector(store => store.spotify.albumInfo)
    console.log("Here is our guess:", guess);
    console.log("Here is our album:", albumInfo);
    return(
        <div className="text-center">
            <p>This is where the recap will go</p>
            <p>
                <>
                    {guess}
                </>
            </p>
            <div>
                <img src={albumInfo.coverArt.url}></img>
                <p>{albumInfo.albumName}</p>
                <p>{albumInfo.releaseDate}</p>
            </div>
        </div>
    )
}

export default RecapPage;