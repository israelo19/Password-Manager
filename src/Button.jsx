import './style.css';
function Button(props){

    // Alerts say added and loaded to make sure alerts work with buttons, passwords have no external storage location yet
    const handleClick = () => {
        if(props.text == "Create Key"){
            alert('Added your new key!');
        } else if (props.text == "Load Key"){
            alert('Loaded your new key!');
        } else if (props.text == "Create Password File"){
            alert('Password file created!');
        } else {
            alert('Password file loaded!');
        }
    }
    
    return(
        <button className = "frontButton" onClick = {handleClick}>{props.text}</button>
    );
}
export default Button