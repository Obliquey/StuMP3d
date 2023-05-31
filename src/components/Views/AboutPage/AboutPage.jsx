import React from 'react';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'
// * This will be our How-To page
function AboutPage() {
  return (
    <div className="text-center self-center">
      <div>
        <p className='text-xl text-center'>WELCOME TO STUMP3D</p>
        <p className='w-96 m-auto'><br></br>
        This is a game where you will test your knowledge of your favorite artists' catalogues! You will search for an artist, and a snippet of a random song of theirs will play.
        You will have four song options presented to you --- pick the one you think is right, and get points! 
        <br></br> <br></br> 
        Or not, if you got it incorrect. But that's ok! You won't be docked THAT many points. However, your streak will be reset to 0.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
