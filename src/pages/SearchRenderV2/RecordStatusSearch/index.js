import * as React from "react";
import { Select, Tree } from "antd";
const { Option } = Select;
const { TreeNode } = Tree;
import { isUndefined } from "lodash";

import * as editorCommand from "../../../command/EditorCommand";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      autoExpandParent: true,
      recordStatus: "",
    };
  }

  componentDidMount = () => {
    this.props.onRecordSearchRef(this);
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.visible !== this.props.visible) {
      if (!nextProps.visible) {
        this.setState({
          data: [],
          recordStatus: "",
        });
      }
    }
  };

  /**
   * 添加叶子节点的数据
   */
  addLeaf = (node, nodeList) => {
    if (node.children.length > 0) {
      for (const item of node.children) {
        this.addLeaf(item, nodeList);
      }
    } else {
      nodeList.push(node);
    }
  };

  /**
   * 过滤出带有备注的节点
   * @param {*} rootData
   * @param {*} nodeList
   */
  filterNote = (rootData, nodeList) => {
    let currNode = rootData.data;
    let childNodes = rootData.children;

    if (!isUndefined(currNode.note) && currNode.note !== "") {
      nodeList.push(rootData);
    }

    if (childNodes.length !== 0) {
      for (const childNode of childNodes) {
        this.filterNote(childNode, nodeList);
      }
    }
  };

  /**
   * 用例遍历
   */
  caseDFS = (rootData, nodeList, type) => {
    let currNode = rootData.data;
    let childNodes = rootData.children;

    if (childNodes.length !== 0) {
      if (isUndefined(currNode.progress)) {
        for (const childNode of childNodes) {
          this.caseDFS(childNode, nodeList, type);
        }
      } else {
        // progress是有被赋值的，那就要判断值是否是我们需要过滤的结果
        if (type !== -1 && currNode.progress === type) {
          this.addLeaf(rootData, nodeList);
        }
      }
    } else {
      if (type === -1) {
        if (isUndefined(currNode.progress)) {
          nodeList.push(rootData);
        }
      } else {
        if (currNode.progress === type) {
          nodeList.push(rootData);
        }
      }
    }
  };

  handleChange = (value) => {
    let data = [];
    if (value === "note") {
      // 处理执行结果过滤的
      this.filterNote(editorCommand.exportJson().root, data);
    } else {
      // 处理执行结果过滤的
      this.caseDFS(editorCommand.exportJson().root, data, value);
    }

    this.setState({
      data,
      recordStatus: value,
    });
  };

  onSelect = (selectedKeys, event) => {
    editorCommand.focusNodeById(event.node.props.eventKey);
  };

  render() {
    const { autoExpandParent, recordStatus } = this.state;

    const loop = (data) =>
      data.map((item) => {
        const text = (
          <span>
            {isUndefined(item.data.text)
              ? "[图片]"
              : item.data.text === ""
              ? "[无文本]"
              : item.data.text}
          </span>
        );
        return <TreeNode key={item.data.id} title={text} />;
      });

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Select
          style={{ margin: "0px 5px" }}
          value={recordStatus}
          placeholder="请选择查询的结果状态"
          onChange={this.handleChange}
        >
          <Option value={-1}>未执行</Option>
          <Option value={9}>通过</Option>
          <Option value={1}>失败</Option>
          <Option value={5}>阻塞</Option>
          <Option value={4}>不适用</Option>
          <Option value={"note"}>带备注</Option>
        </Select>
        {this.state.data.length > 0 && (
          <Tree
            style={{ height: 450, overflowY: "scroll", overflowX: "auto" }}
            defaultExpandAll={true}
            onSelect={this.onSelect}
            autoExpandParent={autoExpandParent}
          >
            {loop(this.state.data)}
          </Tree>
        )}
      </div>
    );
  }
}

export default App;
