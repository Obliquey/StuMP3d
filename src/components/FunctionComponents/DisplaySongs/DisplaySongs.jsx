import { useSelector, useDispatch } from "react-redux";
import DisplayNoSong from "./DisplayNoSong";

// * This component function will be called in the Play Page. It's job is to display the media player (preview url)
// * and poooosibly display the choices too
function DisplaySongs() {
    const songsArrived = useSelector(store => store.spotify.songsArrived)
    const previews = useSelector(store => store.spotify.previews)

    // gotta pick a random song
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
      };

      let song = previews[getRndInteger(0, previews.length)]
    if(song) {
        console.log("Here's our song:",song);
        return (
            <embed className="ml-200" src={song.URL}/>
        )
    } else {
        return <DisplayNoSong />
    }

}

export default DisplaySongs;