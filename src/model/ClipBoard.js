import { isEmpty, remove, isEqual, get, isNull } from "lodash";
import { randomString } from "./../common/helpers/utils";

import * as copy from "copy-to-clipboard";
import { uploadFile } from "./../common/helpers/uploadFile";
import { loadImageSize } from "./../common/helpers/utils";
import config from "../constant/config.minder";
import * as editorCommand from "./../command/EditorCommand";
class Clipboard {
  // 构造函数
  constructor(props) {
    this.setProps(props);
    // 字段
    this.lock = false;
    this.SPLITOR = "\uFEFF";
    this.MIMETYPE = {
      "application/km": "\uFFFF",
    };
    this.SIGN = {
      "\uFEFF": "SPLITOR",
      "\uFFFF": "application/km",
    };

    /**
     * 实际复制的文本
     */
    this.copyText = "";
    // 监听复制事件
    document.addEventListener("copy", this.beforeCopy, false);

    // 监听粘贴事件
    document.addEventListener("paste", this.beforePaste, false);
  }

  setProps = (props) => {
    this.props = props;
  };

  unMount = () => {
    document.removeEventListener("copy", this.beforeCopy);
    document.removeEventListener("paste", this.beforePaste);
  };

  beforeCopy = (e) => {
    if (document.activeElement.id != "kityminder-core") return;
    e.stopPropagation();
    var nodes = [].concat(window.minder.getSelectedNodes());
    if (nodes.length) {
      // 这里由于被粘贴复制的节点的id信息也都一样，故做此算法
      // 这里有个疑问，使用node.getParent()或者node.parent会离奇导致出现非选中节点被渲染成选中节点，因此使用isAncestorOf，而没有使用自行回溯的方式
      if (nodes.length > 1) {
        var targetLevel;
        nodes.sort(function (a, b) {
          return a.getLevel() - b.getLevel();
        });
        targetLevel = nodes[0].getLevel();
        if (targetLevel !== nodes[nodes.length - 1].getLevel()) {
          var pnode,
            idx = 0,
            l = nodes.length,
            pidx = l - 1;

          pnode = nodes[pidx];

          while (pnode.getLevel() !== targetLevel) {
            idx = 0;
            while (idx < l && nodes[idx].getLevel() === targetLevel) {
              if (nodes[idx].isAncestorOf(pnode)) {
                nodes.splice(pidx, 1);
                break;
              }
              idx++;
            }
            pidx--;
            pnode = nodes[pidx];
          }
        }
      }

      var str = "";
      for (const item of nodes) {
        if (str === "") {
          str += item.data.text;
        } else {
          str += "\n" + item.data.text;
        }
      }
      copy(str, { format: "text/plain" });
      localStorage.setItem("copyText", this.encode(nodes));
      this.copyText = this.encode(nodes);
    }
  };

  beforePaste = async (e) => {
    if (window.minder.getStatus() === "normal") {
      if (this.props.props.type === "record") {
        await this.handlePicture(e);
        // 直接修改节点的图片内容 不会触发更新，所以需要手动触发更新的逻辑
        setTimeout(() => {
          window.minder.fire("contentchange");
        }, 500);
      }

      if (!this.props.state.readOnly) {
        if (document.activeElement.id === "kityminder-core") {
          this.handleNode(e);
        }
        if (document.activeElement.id === "core-node-input-disableKeydown") {
          this.handlePicture(e);
        }
      }
    }
  };

  handlePicture = async (e) => {
    const item = get(e, "clipboardData.items[0]", null);
    if (!isNull(item) && item.kind === "file" && item.type.match(/^image\//i)) {
      const imgFile = item.getAsFile();
      const imgUrl = await uploadFile(imgFile, this.props.props.uploadUrl);
      editorCommand.handleImage({ url: imgUrl });
    }
  };

  handleNode = async (e) => {
    this.lock = true;
    e.preventDefault();
    e.stopPropagation();
    var _selectedNodes = [];
    var clipBoardEvent = e;
    var textData = clipBoardEvent.clipboardData.getData("text/plain");

    this.copyText = localStorage.getItem("copyText");
    if (this.copyText !== null && this.copyText !== "") {
      let copyMemText = "";
      let nodeData = this.copyText.split(this.SPLITOR)[1];
      for (const item of JSON.parse(nodeData)) {
        if (copyMemText === "") {
          copyMemText += item.data.text;
        } else {
          copyMemText += "\n" + item.data.text;
        }
      }
      if (copyMemText === textData) {
        textData = this.copyText;
      } else {
        // 清掉复制的内容
        this.copyText = "";
        localStorage.setItem("copyText", "");
      }
    }

    /*
     * 针对normal状态下通过对选中节点粘贴导入子节点文本进行单独处理
     */
    var sNodes = window.minder.getSelectedNodes();
    const data = textData.split(this.SPLITOR);

    if (this.SIGN[data[0]] == "application/km") {
      var nodes = JSON.parse(data[1]);
      var _node;
      sNodes.map((node) => {
        // 由于粘贴逻辑中为了排除子节点重新排序导致逆序，因此复制的时候倒过来
        for (var i = nodes.length - 1; i >= 0; i--) {
          _node = window.minder.createNode(null, node);
          const newNode = this.createNodes([nodes[i]])[0];
          window.minder.importNode(_node, newNode);
          _selectedNodes.push(_node);
          node.appendChild(_node);
        }
      });
      window.minder.select(_selectedNodes, true);
      _selectedNodes = [];

      window.minder.refresh();
    } else {
      sNodes.forEach(function (node) {
        window.minder.Text2Children(node, textData);
      });
    }

    /*
     * 针对normal状态下通过对选中节点粘贴导入图片进行单独处理
     */
    const item = get(clipBoardEvent, "clipboardData.items[0]", null);
    if (!isNull(item) && item.kind === "file" && item.type.match(/^image\//i)) {
      const imgFile = item.getAsFile();
      const imgUrl = await uploadFile(imgFile, this.props.props.uploadUrl);
      let imgInfo = await loadImageSize(imgUrl);
      var _node;
      sNodes.map((node) => {
        let width = imgInfo.width;
        let height = imgInfo.height;
        if (width > 200 && width > height) {
          height = (200 * height) / width;
          width = 200;
        } else if (height > 200 && height > width) {
          width = (200 * width) / height;
          height = 200;
        }
        window.minder.createNode(
          { image: imgUrl, imageSize: { width, height } },
          node
        );
        window.minder.refresh();
      });
    }

    this.lock = false;
  };

  /*
   * 粘贴时处理每一个节点的id，避免出现不同节点的id相同的情况
   */
  createNodes = (nodes) => {
    return nodes.map((node) => {
      node.data.id = randomString(12);
      node.data.creator = this.props.userName;
      // 去掉元数据关联
      delete node.data.sourceId;

      // 去掉已审与待审标签
      remove(node.data.resource, (item) => {
        return (
          isEqual(item, config.reviewTag) || isEqual(item, config.reviewedTag)
        );
      });

      isEmpty(node.children) || this.createNodes(node.children);
      return node;
    });
  };

  /*
   * 增加对多节点复制粘贴的处理
   */
  encode = (nodes) => {
    var _nodes = [];
    for (var i = 0, l = nodes.length; i < l; i++) {
      _nodes.push(window.minder.exportNode(nodes[i]));
    }
    return (
      this.MIMETYPE["application/km"] + this.SPLITOR + JSON.stringify(_nodes)
    );
  };
}

export default Clipboard;
