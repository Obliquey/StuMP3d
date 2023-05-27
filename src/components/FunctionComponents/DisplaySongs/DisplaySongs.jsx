import { useSelector, useDispatch } from "react-redux";
import DisplayNoSong from "./DisplayNoSong";
import DisplayChoices from "../DisplayChoices/DisplayChoice";

// * This component function will be called in the Play Page. It's job is to display the media player (preview url)
// * and poooosibly display the choices too
function DisplaySongs() {
    const songsArrived = useSelector(store => store.spotify.songsArrived)
    const previews = useSelector(store => store.spotify.previews)
    const dispatch = useDispatch();

    // gotta pick a random song
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
      };

    //   Picking a random index from the previews to pick a song
    let songIndex = getRndInteger(0, previews.length);
    let song = previews[songIndex];
    
    

    if(song) {
        let allChoices = [];
        const getOtherChoices = () => {
            // removing the chosen song first
            previews.splice(songIndex, 1)
            for (let i = 0; i < 3; i++) {

                // get a random index from the previews
                let rndInt = getRndInteger(0, previews.length);
                // setting a choice based upon randomized index, then push that into array and remove from previews
                // so there are no duplicate choices pushed
                let choice = previews[rndInt];
                allChoices.push(choice);
                previews.splice(rndInt, 1);
            }
        }
        // concat the chosen song with the other choices to be passed to the choice display component
        getOtherChoices();
        dispatch({
            type: 'POST_SONG'
        })
        allChoices.splice(getRndInteger(0, allChoices.length), 0, song)
        console.log("Choices:", allChoices);

        return (
            <>
                <embed className="m-auto" src={song.URL}/>
                <DisplayChoices 
                    songs={allChoices}
                    correctSong={song}
                />
            </>
        )
    } else {
        return <DisplayNoSong />
    }
}

export default DisplaySongs;