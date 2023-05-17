import * as React from "react";
import { Modal, Tree, Input } from "antd";
const { TreeNode } = Tree;
const { Search } = Input;
import { partial } from "lodash";
import * as editorCommand from "../../../command/EditorCommand";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      data: [],
      dataList: [],
      selectedNodeId: "",
    };
  }

  componentDidMount = () => {};

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.visible !== this.props.visible && nextProps.visible) {
      let json = editorCommand.exportJson();

      this.setState({
        data: [json.root],
      });
    }
  };

  handleOk = () => {
    if (this.state.selectedNodeId !== "") {
      editorCommand.handleNodeLink(this.state.selectedNodeId);
    }
    this.setState({
      searchValue: "",
    });
    this.props.onCancel(false);
  };

  onCancel = () => {
    this.props.onCancel(false);
  };

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  onChange = (e) => {
    const { value } = e.target;

    let dataList = [];
    window.minder.getRoot().traverse((node) => {
      if (node.data.text.indexOf(value) !== -1) {
        dataList.push(node);
      }
    });

    this.setState({
      searchValue: value,
      dataList,
    });
  };

  onSelect = (selectedKeys) => {
    this.setState({
      selectedNodeId: selectedKeys.length > 0 ? selectedKeys[0] : "",
    });
  };

  render() {
    const { visible } = this.props;
    const { searchValue, autoExpandParent } = this.state;

    const loop = (data) =>
      data.map((item) => {
        const index = item.data.text.indexOf(searchValue);
        const beforeStr = item.data.text.substr(0, index);
        const afterStr = item.data.text.substr(index + searchValue.length);
        const text =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: "#f50" }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.data.text}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.data.id} title={text}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.data.id} title={text} />;
      });

    return (
      <Modal
        className="hyperlink-container"
        title="主题链接"
        visible={visible}
        onOk={this.handleOk}
        okText="确定"
        onCancel={partial(this.onCancel)}
        cancelText="取消"
      >
        <Search
          style={{ marginBottom: 8 }}
          placeholder="搜索"
          onChange={this.onChange}
        />
        {this.state.data.length > 0 && (
          <Tree
            style={{ height: 350, overflowY: "scroll", overflowX: "hidden" }}
            defaultExpandAll={true}
            // onExpand={this.onExpand}
            // expandedKeys={expandedKeys}
            onSelect={this.onSelect}
            autoExpandParent={autoExpandParent}
          >
            {this.state.searchValue !== ""
              ? loop(this.state.dataList)
              : loop(this.state.data)}
          </Tree>
        )}
      </Modal>
    );
  }
}

export default App;
