import CallSpotify from "../../FunctionComponents/CallSpotify/CallSpotify";
import DisplaySongs from "../../FunctionComponents/DisplaySongs/DisplaySongs";

// What does this page need to do? This page is going to be the play page, so it will have both the search + play button (probably another component)
// AND the conditional rendering of four choices. 
function PlayPage() {


    return(
        <div className="place-content-center text-center mt-28">
            {/* This is the search function component */}
            <CallSpotify />

            {/* This is the song display component */}
            <DisplaySongs />
        </div>

    )
}

export default PlayPage;