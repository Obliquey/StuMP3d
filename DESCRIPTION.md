**Just wanted to document some issues I overcame:**
    - Setting up the communication (really, authorization) with Spotify API was quite a bit of work. A huge problem I came across early on was needing to authorize the app with the user, doing a three-party handshake between my app, the user, and Spotify's API. Well, my attempts at doing this were blocked by CORS policy for a looooong time. 

    Ultimately, I found that my issue was because I was using a <button> tag rather than a <a> tag when kicking off the authoriation process. Rather than linking the user to the authorization page, it was as if using a <button> tag meant my app was trying to load Spotify's login content, which I guess is a no-no. So, a simple switch to an <a> tag solved that problem.

    - Another problem I came across was in trying to refactor my authorization router. Moving all the Spotify OAuth stuff into it's own router to clean things up, I came across an issue with state mismatch. State is a randomized string made upon each call to the authorize endpoint, that Spotify then sends back upon redirecting the user to my app. I can then check that state they send back with my own stored state, and if the two match then the redirect is safe to accept. I was using cookie-parser for this, but came across that state-mismatch issue. Welllllll it was because I had initialized cookie-parser in my main server file, not in the router. So, I just brought it in quick and placed it as middleware in my OAuth calls, and BAM. Done.

    - How do I get the information around the songs and album to the client-side? Currently, I am extracting it all in the router, so as to deal with less information on the client. Dunno how well that will work, but that's what I'm rolling with for now.
        - That is how I decided to keep doing it. However, I have a small issue of my array-extraction server-side for some reason creates undefined items, which breaks my code before I send it to the client. For now, I've restricted the randomizer to retrieving array.length - 1, because the undefined item was always last. 

    - Had to reformat to a mobile-first design AFTER buidling the whole project. The biggest issue was recreating the table in the user-page, moving it from a side-by-side flow (grid rows) to an above-and-under flow (grid-columns). The table I originally built was wayyyy to wide for mobile devices and unfortunatly wasn't responsive. What I created STILL isn't responsive, but oh well. I really don't see this to be an app people use on their computers much, so if it's primarily mobile-friendly then we're good.
    






**Things I will probably want to do at some point**
    - [X] Refactor my extraction of song + album info. Maybe even send all the info client-side and deal with it there?
    - [X] Really, change all the res.redirects() in spotifyOAuth.router to things that make sense.
    - [X] Will want to edit how I choose albums/tracks to listen to. Say, if one of the albums is a single? 
        - [Don't think this is gonna happen] Also, it'd be nice to make it so that I take tracks from several different albums to choose from, rather than all from the same album.
    - [X] Gotta edit what user information is stored in the user reducer. Or, what's even sent back along to the user saga.
    - [X] Gotta refine my my artist search method ===> specifically, switch to using query params
    - [X] Need to figure out how to get the page to refresh upon item deletion from the table.
    - [X] Implement scoring, using basic score X streak math.
    - [] Need to edit my SQL for storing songs, or at least searching for songs. Somehow, songs with an apostrophe in them disrupt the INSERT
    - [X] Re-format to be mobile-first (particularly concerning is the history table)
    - [] Error pop-ups for when Spotify calls error out
    - [] Add images to the How-To page to make the gameplay clearer
    - [] Would loooove to add some animations to the play button. Either a thumping for the play button or 
            some audio-visuals of the music.


**BUGS**

    - [?] Getting an undefined item in my albumArr in the spotifyAPI router.
    - [] For some reason, some times the user's history table DELETE button takes a couple clicks before it successfully deletes. 
    - [] 