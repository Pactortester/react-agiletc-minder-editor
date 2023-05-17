import * as React from "react";
import { Drawer, Tabs, Icon, Select } from "antd";
const { Option } = Select;
const { TabPane } = Tabs;
import ContentSearch from "./ContentSearch";
import RecordSearch from "./RecordStatusSearch";
import "./style.less";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: "1",
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.visible !== this.props.visible && !nextProps.visible) {
      this.setState({
        activeKey: "1",
      });
    }
  };

  onChange = (activeKey) => {
    this.setState({
      activeKey,
    });
  };

  render() {
    const { visible, expand } = this.props;
    return (
      <React.Fragment>
        <div
          className="search-v2-container"
          style={{
            display: visible ? "block" : "none",
            top: expand ? "120px" : "37px",
          }}
        >
          <div className="drawer-header">
            <span className="drawer-title">导航</span>
            <Icon
              type="close"
              style={{ cursor: "pointer" }}
              onClick={() => {
                this.props.handleState("searchDrawerVisible", false);
              }}
            />
          </div>

          <Tabs activeKey={this.state.activeKey} onChange={this.onChange}>
            <TabPane
              tab={
                <span>
                  <Icon type="apartment" />
                  节点查询
                </span>
              }
              key="1"
            >
              <ContentSearch
                type={this.props.type}
                visible={visible}
                activeKey={this.state.activeKey}
              ></ContentSearch>
            </TabPane>
            {this.props.recordId !== "" &&
            this.props.recordId !== "undefined" ? (
              <TabPane
                tab={
                  <span>
                    <Icon type="carry-out" />
                    状态
                  </span>
                }
                key="2"
              >
                <RecordSearch
                  onRecordSearchRef={this.props.onRecordSearchRef}
                  visible={visible}
                ></RecordSearch>
              </TabPane>
            ) : null}
          </Tabs>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
