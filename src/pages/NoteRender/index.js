import * as React from "react";
import "./style.less";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        id="note-previewer"
        className="note-preview-container"
        style={{ display: "none" }}
      >
        <p id="note-preview-content"></p>
      </div>
    );
  }
}

export default App;
