import { useEffect } from "react";



// *This component will pretty much only contain the spotify login link. However, it would be nice to have a check where, 
// *if the user has already previously given Spotify authorization, then it redirects them to the PlayPage
function SpotifyLogin() {

    useEffect(() => {
        clickLink();
    }, [])

    // this isn't a great solution, it's too slow
    const clickLink = () => {
        document.getElementById('spotifyLink').click();
        console.log("Does my click() work?");
    }
    return(
        <>
            <a id="spotifyLink" href="http://localhost:5000/api/spotifyOAuth/login">LOGIN TO SPOTIFY</a>
        </>
    )
}

export default SpotifyLogin;