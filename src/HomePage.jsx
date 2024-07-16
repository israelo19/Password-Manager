import { useState, useEffect } from "react";

export default function HomePage(props){
    // Words to shuffle through
    const wordArray = ["secure", "safe", "protected"];
    const [word, setWord] = useState(0);
    const [fade, setFade] = useState('fadeIn');

    useEffect(() => {
        const intervalId = setInterval(() => {
            setFade(''); // Removes the fade class to restart the fade animation per word
            setTimeout(() => {
                setWord((prevWord) => (prevWord + 1) % wordArray.length); // Updating the word using a circular queue style
                setFade('fadeIn'); // After the word is updated, the fade animation is reapplied
            }, 10); // Small delay to ensure DOM update
        }, 5000); // Word will be displayed for 5 seconds
    
        return () => clearInterval(intervalId);
    }, [wordArray.length]);

    return(
        <>
            <div>
                <h1 id = "home-page-head" className="hacker-text">A <span className={`${fade}`}>{wordArray[word]}</span> password manager</h1>
            </div>
        </>
        );
}