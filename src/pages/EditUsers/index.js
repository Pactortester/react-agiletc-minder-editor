import * as React from "react";
import { Collapse } from "antd";
const { Panel } = Collapse;
import "./style.less";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps = (nextProps) => {};

  render() {
    const { userName, editUsers } = this.props;

    return (
      <div className="edit-users-container">
        <Collapse>
          <Panel
            header={
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                {editUsers.length}人正在查看
              </div>
            }
            key="1"
          >
            {editUsers.map((item) => {
              return (
                <div className="user-container">
                  <div className="name">{item}</div>
                  {userName === item ? <span className="me">(我)</span> : null}
                </div>
              );
            })}
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default App;
