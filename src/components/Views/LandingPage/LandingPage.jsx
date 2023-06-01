import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function LandingPage() {
    const history = useHistory();

    return (
        <div className="grid grid-cols-1 place-items-center space-y-3 m-auto mt-36">
            <p className="text-4xl">StuMP3d</p>
            <img className="bg-play bg-cover bg-no-repeat, w-72 h-auto" src="https://www.freepnglogos.com/uploads/play-button-png/circular-play-button-svg-png-icon-download-onlinewebfontsm-30.png"/>
            <button 
            className="border border-black p-2 rounded-md bg-white"
            onClick={() => history.push('/login')}
            >Login or Register</button>
            <button 
            className="border border-black p-2 rounded-md bg-white"
            onClick={() => history.push('/about')}
            >How To Play</button>
        </div>
    )
}

export default LandingPage;