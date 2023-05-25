**Just wanted to document some issues I overcame:**
    - Setting up the communication (really, authorization) with Spotify API was quite a bit of work. A huge problem I came across early on was needing to authorize the app with the user, doing a three-party handshake between my app, the user, and Spotify's API. Well, my attempts at doing this were blocked by CORS policy for a looooong time. 

    Ultimately, I found that my issue was because I was using a <button> tag rather than a <a> tag when kicking off the authoriation process. Rather than linking the user to the authorization page, it was as if using a <button> tag meant my app was trying to load Spotify's login content, which I guess is a no-no. So, a simple switch to an <a> tag solved that problem.

    - Another problem I came across was in trying to refactor my authorization router. Moving all the Spotify OAuth stuff into it's own router to clean things up, I came across an issue with state mismatch. State is a randomized string made upon each call to the authorize endpoint, that Spotify then sends back upon redirecting the user to my app. I can then check that state they send back with my own stored state, and if the two match then the redirect is safe to accept. I was using cookie-parser for this, but came across that state-mismatch issue. Welllllll it was because I had initialized cookie-parser in my main server file, not in the router. So, I just brought it in quick and placed it as middleware in my OAuth calls, and BAM. Done.

    - How do I get the information around the songs and album to the client-side? Currently, I am extracting it all in the router, so as to deal with less information on the client. Dunno how well that will work, but that's what I'm rolling with for now.





**Things I will probably want to do at some point**
    - [] Refactor my extraction of song + album info. Maybe even send all the info client-side and deal with it there?
    - [] Change the error pages of when the User authorizes my app with Spotify, if there is a state-mismatch or an invalid token.
    - [] Really, change all the res.redirects() is spotifyOAuth.router to things that make sense.
    - [] Will want to edit how I choose albums/tracks to listen to. Say, if one of the albums is a single? 
        - [] Also, it'd be nice to make it so that I take tracks from several different albums to choose from, rather than all from the same album.
    - [] Gotta edit what user information is stored in the user reducer. Or, what's even sent back along to the user saga.