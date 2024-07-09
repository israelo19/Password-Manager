import Header from './Header.jsx';
import FrontPageDiv from './FrontPageDiv.jsx';

function App() {
  return(
    <>
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

export default App
