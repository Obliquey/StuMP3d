

function DisplayChoices(props) {
    console.log("Here's our props:", props);
    return (
        <>
            {
                props.songs.map(song => {
                    return (
                        <p>{song.name}</p>
                    )
                })
            }
        </>
    )
}
export default DisplayChoices;