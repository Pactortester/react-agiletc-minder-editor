import * as React from "react";
import { Input } from "antd";
import * as editorCommand from "./../../../command/EditorCommand";
import "./style.less";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasEdit: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { nodeInfo } = this.props;
    if (nodeInfo.id != nextProps.nodeInfo.id)
      this.handleNote(nodeInfo.note, nodeInfo.id);
  }

  updateNote = (value) => {
    window.editor.runtime.updateNote(value);
    this.setState({ hasEdit: true });
  };

  handleNote = (note, id) => {
    if (!this.state.hasEdit) return;
    editorCommand.handleNote(note, id);
    this.setState({ hasEdit: false });
  };

  render() {
    const { nodeInfo } = this.props;
    let editable = true;
    return (
      <div className="note-container">
        {editable && (
          <Input.TextArea
            placeholder="支持Markdown写法"
            id="note-input-disableKeydown"
            style={{ height: "100%" }}
            value={nodeInfo.note}
            onBlur={(e) => {
              this.handleNote(e.target.value, nodeInfo.id);
            }}
            onChange={(e) => this.updateNote(e.target.value)}
          />
        )}
        {editable || <p>{nodeInfo.note}</p>}
      </div>
    );
  }
}

export default App;
