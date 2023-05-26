

function DisplayChoices(props) {
    console.log("Here's our props:", props);
    console.log("Here's our correct song:", props.correctSong);
    
    const handleChoice = (song) => {
        if(song === props.correctSong.name) {
            console.log("Good job! You correctly guessed:", song);
        } else {
            console.log("Try again!");
        }
    }

    // made to randomize the order of songs
    // function shuffleArray(array) {
    //     for (let i = array.length - 1; i > 0; i--) {
    //         let j = Math.floor(Math.random() * (i + 1));
    //         let temp = array[i];
    //         array[i] = array[j];
    //         array[j] = temp;
    //     }
    //     return array;
    // }
    // shuffleArray(props.songs)
    return (
        <>
            {
                props.songs.map(song => {
                    return (
                        <button 
                            className="border rounded-full p-2 bg-purple-700 m-2 text-white font-medium"
                            onClick={() => handleChoice(song.name)}
                        >
                              
                                {song.name}

                        </button>
                    )
                })
            }
        </>
    )
}
export default DisplayChoices;