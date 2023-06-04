import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'
// * This will be our How-To page
function AboutPage() {
  const history = useHistory();
  return (
    <div className="text-center self-center text-white mt-12 w-auto antialiased">
      <div>
        <p className='text-2xl text-center border border-t-0 border-x-0 border-b-4 border-double mx-6'>WELCOME TO STUMP3D</p>
        {/* <p className='w-auto m-auto font-mono'><br></br>
        This is a game where you will test your knowledge of your favorite artists' catalogues! You will search for an artist, and a snippet of a random song of theirs will play.
        Four song options will be presented to you --- pick the one you think is right, and get points! 
        <br></br> <br></br> 
        Or not, if you got it incorrect. But that's ok! You won't be docked THAT many points. However, your streak will be reset to 0.
        <br></br><br></br>
        So go at it! Test the music knowledge of your friends, family, random people on the bus, whoever! Have fun, and don't get stuMP3d!
        </p> */}
        

        <p className='mt-8 border  border-x-0 border-t-1 mx-4 py-4 font-mono'>
          This game was made using a combination of: 
          <ul className='mt-2 list-disc mx-24 mb-8'>
            <li className='mt-2 border border-x-0 border-t-0 border-dotted font-mono'>Javascript</li>
            <li className='mt-2 border border-x-0 border-t-0 border-dotted font-mono'>React</li>
            <li className='mt-2 border border-x-0 border-t-0 border-dotted font-mono'>Redux/Sagas</li>
            <li className='mt-2 border border-x-0 border-t-0 border-dotted font-mono'>Spotify API</li>
            <li className='mt-2 border border-x-0 border-t-0 border-dotted font-mono'>PostgreSQL</li>
            <li className='mt-2 border border-x-0 border-t-0 border-dotted font-mono'>TailwindCSS</li>
            <li className='mt-2 border border-x-0 border-t-0 border-dotted font-mono'>Material UI</li>
          </ul>

          Connect with me on LinkedIn: <a className='underline' href='https://www.linkedin.com/in/anders--boyum/'>https://www.linkedin.com/in/anders--boyum/</a>
          <br></br>
          <br></br>
          Or check out my other projects: <a className='underline' href='https://github.com/Obliquey'>https://github.com/Obliquey</a>
          <br></br>
          <br></br>
          Or reach out to me at Acboyum@gmail.com
        </p>
      </div>
      <button
          className='border rounded-full p-2 bg-white text-black mt-10 font-mono'
          onClick={() => {
            history.push('/landing')
          }}
        >
          Back
        </button>
    </div>
  );
}

export default AboutPage;
