import Button from './Button.jsx';

function FrontPageDiv(props){
    return(
        <div className = "frontDivider">
            <div className = "boxes">
                {/* Used props to allow this component to be used multiple times */}
            <h3 className = "frontHeader hacker-text">{props.heading}</h3>
            <form>
                <label for="key">{props.formText}</label>
                <input type="text" id="key" name="key" className="frontForms"></input>
                <br></br>
                <Button text={props.buttonText}/>
            </form>
            </div>
        </div>
    );
}

export default FrontPageDiv