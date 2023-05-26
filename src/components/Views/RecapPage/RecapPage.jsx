import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

function RecapPage() {
    const guess = useSelector(store => store.guess.guess)
    console.log("Here is our guess:", guess);
    return(
        <>
            <p>This is where the recap will go</p>
            <p>
                <>
                    {guess}
                </>
            </p>
        </>
    )
}

export default RecapPage;