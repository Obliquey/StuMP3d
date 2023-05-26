import { useSelector, useDispatch } from "react-redux";
import DisplayNoSong from "./DisplayNoSong";
import DisplayChoices from "../DisplayChoices/DisplayChoice";

// * This component function will be called in the Play Page. It's job is to display the media player (preview url)
// * and poooosibly display the choices too
function DisplaySongs() {
    const songsArrived = useSelector(store => store.spotify.songsArrived)
    const previews = useSelector(store => store.spotify.previews)

    // gotta pick a random song
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
      };

    //   currently, I'm picking the song from this component, but I'm wondering if I should pick in on the server and put it in it's own reducer?
    console.log("Previews.length:", previews.length);
    let songIndex = getRndInteger(0, previews.length);
    let song = previews[songIndex];
    
    

    if(song) {
        let allChoices = [];
        const getOtherChoices = () => {
            previews.splice(songIndex, 1)
            for (let i = 0; i < 3; i++) {
                console.log("Choice:", allChoices);
                let rndInt = getRndInteger(0, previews.length);
                let choice = previews[rndInt];
                allChoices.push(choice);
                previews.splice(rndInt, 1);
            }
        }
        // concat the chosen song with the other choices to be passed to the choice display component
        getOtherChoices();
        allChoices.splice(getRndInteger(0, allChoices.length), 0, song)
        console.log("All our choices:", allChoices);

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
    // return <DisplayNoSong />
}

export default DisplaySongs;