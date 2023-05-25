import CallSpotify from "../CallSpotify/CallSpotify";


// What does this page need to do? This page is going to be the play page, so it will have both the search + play button (probably another component)
// AND the conditional rendering of four choices. 
function PlayPage() {


    return(
        <body>
            {/* This is the search function */}
            <CallSpotify />

            {/* This is the song display */}

        </body>

    )
}

export default PlayPage;