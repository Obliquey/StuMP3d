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
      </div>
    </div>
  );
}

export default AboutPage;
