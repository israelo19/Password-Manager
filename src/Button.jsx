import './style.css';
function Button(props){
    return(
        <button className = "frontButton">{props.text}</button>
    );
}
export default Button