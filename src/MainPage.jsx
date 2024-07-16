import Header from './Header.jsx';
import FrontPageDiv from './FrontPageDiv.jsx';

export default function MainPage() {
  return(
    <>
    {/* Website starts with the header, which displays the title of the website*/}
      <Header/>
      <h2 className = "hacker-text">Key Management</h2>
      <hr></hr>
      <FrontPageDiv heading = "Create Key" buttonText="Create Key"/>
      <FrontPageDiv heading = "Load Key" buttonText="Load Key"/>
      <h2 className = "hacker-text">Password File Management</h2>
      <hr></hr>
      <FrontPageDiv heading = "Create Password File" buttonText="Create Password File"/>
      <FrontPageDiv heading = "Load Password File" buttonText="Load Password File"/>
      
    </>
  );
}