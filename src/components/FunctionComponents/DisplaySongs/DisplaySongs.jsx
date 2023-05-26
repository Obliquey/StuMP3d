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
      let song = previews[getRndInteger(0, previews.length)]

    //   gotta get the other choices for the user to guess from
      let allChoices = [];
      const getOtherChoices = () => {
        for (let i = 0; i < 3; i++) {
            let choice = previews[getRndInteger(0, previews.length)];
            if (choice !== song){
                allChoices.push(choice)
            }
        }
      }

    if(song) {
        // concat the chosen song with the other choices to be passed to the choice display component
        allChoices.push(song)
        console.log("Here's our song:",song);
        console.log("Here are our other choices:", allChoices);
        // console.log("All the user options:", totalChoices);
        getOtherChoices();

        return (
            <>
                <embed className="m-auto" src={song.URL}/>
                <DisplayChoices 
                    songs={allChoices}
                />
            </>
        )
    } else {
        return <DisplayNoSong />
    }
    // return <DisplayNoSong />
}

export default DisplaySongs;