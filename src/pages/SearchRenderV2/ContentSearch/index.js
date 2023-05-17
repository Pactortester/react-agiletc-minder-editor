import * as React from "react";
import { Input, Tree, Icon } from "antd";
import * as editorCommand from "../../../command/EditorCommand";
const { TreeNode } = Tree;
import { isString, cloneDeep, isUndefined } from "lodash";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      autoExpandParent: true,
      searchValue: "",
    };
  }

  componentDidMount = () => {
    window.minder.on("contentchange", this.contentReSearch);
    // let json = editorCommand.exportJson();
    // this.setState({
    //     data: [json.root],
    // })

    if (this.props.visible) {
      if (this.props.type === "compare") {
        this.onChange({ target: { value: "待审" } });
      } else {
        let json = editorCommand.exportJson();
        this.setState({
          data: [json.root],
        });
      }
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.visible !== this.props.visible) {
      if (nextProps.visible) {
        if (nextProps.type === "compare") {
          this.onChange({ target: { value: "待审" } });
        } else {
          let json = editorCommand.exportJson();
          this.setState({
            data: [json.root],
          });
        }
      } else {
        this.setState({
          searchValue: "",
        });
      }
    }
  };

  contentReSearch = () => {
    // 只有search可见的时候才处理这个逻辑
    if (this.props.visible) {
      this.onChange({ target: { value: this.state.searchValue } });
    }
  };

  onSelect = (selectedKeys, event) => {
    let key = event.node.props.eventKey.split("_")[0];
    editorCommand.focusNodeById(key);
  };

  /**
   * 文本框发生变化时
   */
  onChange = (e) => {
    const { value } = e.target;

    let data = [];
    if (value !== "") {
      window.minder.getRoot().traverse((node) => {
        if (
          !isUndefined(node.data.text) &&
          node.data.text.indexOf(value) !== -1
        ) {
          data.push(node);
        }

        // 也需要去过滤resource这块的内容
        let nodeResource = node.getData("resource");
        // let isFind = false;
        nodeResource &&
          nodeResource.map((resource) => {
            if (resource !== null) {
              if (isString(resource)) {
                if (resource.toLowerCase().indexOf(value) != -1) {
                  let nodeTemp = cloneDeep(node);
                  nodeTemp.data.id = nodeTemp.data.id + "_tag";
                  nodeTemp.data.text = resource;
                  data.push(nodeTemp);
                }
              } else {
                if (resource.name.toLowerCase().indexOf(value) != -1) {
                  let nodeTemp = cloneDeep(node);
                  nodeTemp.data.id = nodeTemp.data.id + "_tag";
                  nodeTemp.data.text = resource.name;
                  data.push(nodeTemp);
                }
              }
            }
          });
      });
    } else {
      data = [editorCommand.exportJson().root];
    }

    this.setState({
      searchValue: value,
      data,
    });
  };

  render() {
    const { autoExpandParent, searchValue } = this.state;

    const loop = (data) =>
      data.map((item) => {
        const index = isUndefined(item.data.text)
          ? -1
          : item.data.text.indexOf(searchValue);
        const beforeStr = isUndefined(item.data.text)
          ? ""
          : item.data.text.substr(0, index);
        const afterStr = isUndefined(item.data.text)
          ? ""
          : item.data.text.substr(index + searchValue.length);
        const text =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: "#f50" }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>
              {isUndefined(item.data.text)
                ? "[图片]"
                : item.data.text === ""
                ? "[无文本]"
                : item.data.text}
            </span>
          );

        if (searchValue === "" && item.children) {
          return (
            <TreeNode key={item.data.id} title={text}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            icon={
              item.data.id.indexOf("_tag") !== -1 ? <Icon type="tag" /> : null
            }
            key={item.data.id}
            title={text}
          />
        );
      });

    return (
      <div style={{ height: "100%" }}>
        <div style={{ margin: "0px 10px" }}>
          <Input
            value={searchValue}
            placeholder="搜索"
            onChange={this.onChange}
          />
        </div>

        {this.state.data.length > 0 && (
          <div style={{ overflow: "auto", height: "100%" }}>
            <Tree
              showIcon={true}
              style={{}}
              defaultExpandAll={true}
              onSelect={this.onSelect}
              autoExpandParent={autoExpandParent}
            >
              {loop(this.state.data)}
            </Tree>
          </div>
        )}
      </div>
    );
  }
}

export default App;
