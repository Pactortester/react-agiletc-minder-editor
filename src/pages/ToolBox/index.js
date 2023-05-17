import * as React from "react";
import { Tabs, Icon, Tooltip } from "antd";
import "./style.less";
import Note from "./Note";
import { partial } from "lodash";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lock: false,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    // 支持锁定状态
    if (this.state.lock) return;
    // 更新满足任一：1、显示状态切换 2、可见时，切换节点
    if (
      nextProps.toolbox != this.props.toolbox ||
      (nextProps.toolbox && nextProps.nodeInfo.id != this.props.nodeInfo.id)
    ) {
      this.initData(nextProps);
    }
  };

  /**
   * 选中tab
   * @param {*} toolboxTab
   */
  setTab = (toolboxTab) => {
    this.props.handleState("toolboxTab", toolboxTab);
  };

  setToolbox = (visible, tab) => {
    window.editor.toolbox.setToolbox(visible, tab);
  };

  setLock = (value) => {
    this.setState({ lock: value }, () => {
      if (!value) this.initData(this.props);
    });
  };

  initData = (nextProps) => {
    const { nodeInfo } = nextProps;
    this.setState({ nodeId: nodeInfo.id }); // 防止锁定状态下使用的节点数据错误
  };

  render() {
    const { toolboxTab, toolbox, readOnly, type } = this.props;
    const { lock } = this.state;

    return (
      <div>
        <div
          className="icon-container"
          onClick={partial(
            this.setToolbox,
            true,
            (readOnly && type === "compare") || !readOnly ? "review" : "note"
          )}
          style={{ display: toolbox ? "none" : "block" }}
        >
          <Icon className="m-icon" type="bars" />
        </div>
        <div
          className="toolbox-container"
          style={{ display: toolbox ? "block" : "none" }}
        >
          <div className="toolbox-icon">
            <Tooltip title="锁定后，评审内容不随节点切换而更新">
              <Icon
                type={lock ? "lock" : "unlock"}
                className="m-lock"
                onClick={partial(this.setLock, !lock)}
              />
            </Tooltip>
            <Icon
              type="close"
              className="m-close"
              onClick={partial(
                this.setToolbox,
                false,
                (readOnly && type === "compare") || !readOnly
                  ? "review"
                  : "note"
              )}
            />
          </div>
          <Tabs
            defaultActiveKey="note"
            size="small"
            className="m-tabs"
            activeKey={toolboxTab}
            onTabClick={(key) => this.setTab(key)}
          >
            {type === "compare" ? null : <Tabs.TabPane tab="备注" key="note" />}
          </Tabs>
          {toolboxTab == "note" && <Note nodeInfo={this.props.nodeInfo} />}
        </div>
      </div>
    );
  }
}

export default App;
