import React from 'react';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'
// * This will be our How-To page
function AboutPage() {
  return (
    <div className="container">
      <div>
        <p className='text-xl text-center'>Gotta put in some instructions for the game!</p>
      </div>
    </div>
  );
}

export default AboutPage;
