import { useSelector, useDispatch } from "react-redux";

// * This component function will be called in the Play Page. It's job is to display the media player (preview url)
// * and poooosibly display the choices too
function DisplaySongs() {
    const previews = useSelector( store => store.spotify[1])

    // gotta pick a random song
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
      };

    let song = previews[getRndInteger(0, previews.length)]

    return(
        <div>
            {
                <>
                    if()
                </>
            }
        </div>
    )
}

export default DisplaySongs;