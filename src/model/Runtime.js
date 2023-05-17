// import EditorMode from '@/app/modes/Kityminder';
import * as editorCommand from "./../command/EditorCommand";
import { isNull, isUndefined, isEmpty } from "lodash";

import $ from "jquery";

class Runtime {
  // 构造函数
  constructor(props) {
    this.editNodeId = "";
    // this._EditorMode = new EditorMode(props);
    this.setProps(props);
    this.reset();

    window.minder.on("selectionchange", this.updateNodeInfo);

    // 脑图重新导入数据时，数据初始化
    window.minder.on("import", () => {
      this.isInit = true;
      this.updateNodeInfo();
      props.handleState("theme", editorCommand.getTheme());
      props.handleState("template", editorCommand.getTemplate());
      // this._EditorMode.set({ theme: editorCommand.getTheme(), template: editorCommand.getTemplate() });
    });

    window.minder.on("viewchange", () => {
      // if (this.isEdit) {
      //     this.handleEdit(props.state.editText);
      // }
    });

    // 脑图导入完成时，将loading状态去掉
    window.minder.on("layoutallfinish", () => {
      if (this.isInit) {
        // 获取到所有的标签节点
        let usedResource = window.minder.getUsedResource();
        props.handleState("usedResource", usedResource);
        props.handleState("spinning", false);
        this.isInit = false;
      }

      // console.log(this.usedResouces, 'usedResouces')
      // isEmpty(this.props.minderData) || isEmpty(this.props.minderData.data) || this._EditorMode.set({ loading: false }); // 避免初次进来数据还没回来，脑图初始化完成就把loading状态置为false
    });

    window.minder.on("mousewheel", () => {
      // console.log("鼠标滚轮滚动");
      if (this.isEdit) {
        this.handleEdit(props.state.editText);
      }
    });

    // 由于kityminder-core屏蔽了所有原生事件，故需要手动处理kityminder-core无法获取焦点的问题，坑！
    window.minder.on("click", (e) => {
      document.getElementById("kityminder-core").focus();
    });

    if (props.props.type !== "compare" && props.props.type !== "backup") {
      window.minder.on("contextmenu", (e) => {
        if (window.minder.getStatus() === "normal") {
          if (editorCommand.isNode()) {
            const position = window.minder
              .getSelectedNode()
              .getRenderBox("TextRenderer");
            window.editor.hotbox.active(position.cx, position.cy);
          }
        }
      });
    }

    // 监听快捷键
    document
      .getElementById("kityminder-core")
      .addEventListener("keydown", this.handleListenerForEditor, false);

    if (!props.state.readOnly) {
      // 双击节点进入编辑状态
      window.minder.on("dblclick", (e) => {
        if (window.minder.getStatus() === "normal") {
          // 只是选中单个节点 , 这里需要延迟处理，因为kityminder-core会响应双击的操作然后将节点做选中，所以这里需要稍等下
          setTimeout(() => {
            this.handleEdit();
          }, 50);
        }
      });
    }

    // 监听输入框的键盘事件
    document
      .getElementById("core-node-input-disableKeydown")
      .addEventListener("keydown", this.handleListenerForInput, false);

    // 鼠标按下前，退出编辑并更新节点text
    window.minder.on("beforemousedown", (e) => {
      if (this.isEdit) {
        this.saveAndExit();
      }
    });
  }

  handleListenerForInput = (e) => {
    if (!this.isEdit) {
      return;
    }
    if (!e.altKey && e.keyCode === 13) {
      // Enter 保存并退出
      e.stopPropagation();
      e.preventDefault();
      this.saveAndExit();
      return;
    }

    if (e.altKey && e.keyCode === 13) {
      // Alt + Enter 换行
      e.stopPropagation();
      e.preventDefault();
      const value = $("#core-node-input-disableKeydown").val();
      let posReal = document.getElementById("core-node-input-disableKeydown")[
        "selectionStart"
      ];
      let pos = posReal; //? posReal : String(value).length - 1;
      const newValue =
        String(value).substr(0, pos) +
        "\r\n" +
        String(value).substr(pos, String(value).length);
      this.props.handleChange(newValue);
      document.getElementById("core-node-input-disableKeydown")[
        "setSelectionRange"
      ] &&
        document
          .getElementById("core-node-input-disableKeydown")
          ["setSelectionRange"](pos + 1, pos + 1);
      return;
    }
  };

  setProps = (props) => {
    this.props = props;
  };

  handleEdit = (text) => {
    // if (!this.props.editable || !editorCommand.isNode()) return;

    if (window.minder.getStatus() !== "normal") return;
    let selectedNode = editorCommand.getSelectedNode();

    if (selectedNode === null) return;
    // 选中节点
    this.editNodeId = selectedNode.getData("id");
    editorCommand.selectNode(this.editNodeId);
    const position = selectedNode.getRenderBox();
    // const element  = document.getElementById('kityminder-editor');
    let inputElement = document.getElementById("node-input-container");
    inputElement.style.width = String(position.width + 100) + "px";
    inputElement.style.left = String(position.x) + "px"; // - position.width / 2
    inputElement.style.top = String(position.y) + "px"; //- position.height / 2
    inputElement.style.display = "block";
    const value = isUndefined(text) ? selectedNode.data.text : text;
    document.getElementById("core-node-input-disableKeydown").focus();
    this.setEdit(true, value);
  };

  saveAndExit = () => {
    const value = $("#core-node-input-disableKeydown").val();
    editorCommand.handleText(value, this.editNodeId);
    this.editExit();
  };

  editExit = () => {
    document.getElementById("node-input-container").style.display = "none";
    this.setEdit(false, "");
    document.getElementById("kityminder-core").focus();
  };

  /**
   * 设置执行结果
   * @param {*} key
   */
  handleExecuteResult = (key) => {
    editorCommand.handleResult(key);
    if (this.props.props.onResultChange) {
      this.props.props.onResultChange();
    }
  };

  /**
   * 添加标签
   * @param {} value
   */
  addTag = (value) => {
    if (editorCommand.isNode()) {
      let temp = editorCommand.getResource();
      if (temp.indexOf(value) === -1) {
        editorCommand.handleResource(value, 0);
      }
    }
  };

  handleListenerForEditor = (e) => {
    // if (!this.props.editable) return;
    if (this.isEdit) {
      return;
    }

    if (!this.props.state.readOnly) {
      if (e.keyCode === 27) {
        // 退出编辑、右键菜单Esc
        e.stopPropagation();
        e.preventDefault();
        this.editExit();
        window.editor.hotbox.idle();
        return;
      }

      // 需要判断某些情况下不响应快捷键
      if (document.activeElement.id.indexOf("disableKeydown") !== -1) return;
      if (e.shiftKey && e.keyCode === 9) {
        // 父级主题shift + Tab
        this.handleAppend("parentNode");
        e.stopPropagation();
        e.preventDefault();
        window.editor.hotbox.idle();
        return;
      }

      if (e.keyCode === 9 && !e.shiftKey) {
        // 下级主题Tab
        this.handleAppend("childNode");
        e.stopPropagation();
        e.preventDefault();
        window.editor.hotbox.idle();
        return;
      }
      if (e.keyCode === 13) {
        // 同级主题Enter
        this.handleAppend("siblingNode");
        e.stopPropagation();
        e.preventDefault();
        window.editor.hotbox.idle();
        return;
      }

      if (e.keyCode === 113) {
        // F2
        this.handleEdit();
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.keyCode === 49) {
        // 前置条件  ctrl + 1
        this.addTag("前置条件");
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.keyCode === 50) {
        // 操作步骤  ctrl + 2
        this.addTag("执行步骤");
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.keyCode === 51) {
        // 预期结果 ctrl + 3
        this.addTag("预期结果");
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.keyCode === 75) {
        // Ctrl + K 调出链接的添加菜单
        let selectedNode = window.minder.getSelectedNode();
        if (selectedNode === null) return;
        this.props.setMindHyperLinkVisible();
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if (e.altKey && e.keyCode === 38) {
        // 节点上移alt + Up
        editorCommand.handleUp();
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      if (e.altKey && e.keyCode === 40) {
        // 节点下移alt + Down
        editorCommand.handleDown();
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if (e.keyCode === 8 || e.keyCode === 46) {
        // 删除Delete
        editorCommand.handleRemove();
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if (e.keyCode === 32) {
        // 空格键
        this.handleEdit();
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.keyCode === 88) {
        // 撤销Ctrl + X
        window.editor.clipBoard.beforeCopy(e);
        editorCommand.cutNodes();
        e.stopPropagation();
        e.preventDefault();
        return;
      }
    }

    // 如果是任务执行
    if (this.props.props.type === "record") {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 48) {
        // 清除执行结果  ctrl + 0
        this.handleExecuteResult(0);
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.keyCode === 49) {
        //执行通过   ctrl + 1
        this.handleExecuteResult(2);
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.keyCode === 50) {
        //执行失败 ctrl + 2
        this.handleExecuteResult(1);
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.keyCode === 51) {
        //阻塞  ctrl+3
        this.handleExecuteResult(3);
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.keyCode === 52) {
        // 不适用 预期结果 ctrl + 4
        this.handleExecuteResult(4);
        e.stopPropagation();
        e.preventDefault();
        return;
      }
    }

    if (e.ctrlKey && e.keyCode === 65) {
      // 全选Ctrl + a
      let selectedNodes = [];
      window.minder.getRoot().traverse((node) => {
        selectedNodes.push(node);
      });
      window.minder.select(selectedNodes, true);
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 90) {
      // 撤销Ctrl + z
      window.editor.history.undo();
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) {
      // 撤销Ctrl + F
      // window.editor.search.setSearch(true);
      this.props.handleState("searchDrawerVisible", true);
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.keyCode === 187) {
      // 缩小
      editorCommand.zoomIn();
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.keyCode === 189) {
      // 放大
      editorCommand.zoomOut();
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.keyCode === 89) {
      // 重做Ctrl + y
      window.editor.history.redo();
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
      // ctrl + s
      this.props.props.onSave && this.props.props.onSave();
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 76) {
      // Ctrl +shift + L
      editorCommand.resetLayout();
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    window.minder.fire("normal.keydown", e);
  };

  isIntendToInput(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return false;

    // a-zA-Z
    if (e.keyCode >= 65 && e.keyCode <= 90) return true;

    // 0-9 以及其上面的符号
    if (e.keyCode >= 48 && e.keyCode <= 57) return true;

    // 小键盘区域 (除回车外)
    if (e.keyCode !== 108 && e.keyCode >= 96 && e.keyCode <= 111) return true;

    // 输入法
    if (e.keyCode === 229 || e.keyCode === 0) return true;

    return false;
  }

  handleAppend = (type) => {
    this.AppendLock++;
    editorCommand.handleAppend(type, "");
    setTimeout(this.afterAppend, 300);
    // window.minder.on('layoutallfinish', this.afterAppend);
  };

  afterAppend = () => {
    if (!--this.AppendLock) {
      this.handleEdit();
    }
    // window.minder.off('layoutallfinish', this.afterAppend);
  };

  reset() {
    this.listenDisable = true;
    this.nodeInfo = {
      id: "",
      text: "",
      note: "",
      hyperlink: {},
      image: {},
      timeStamp: String(new Date().getTime()),
    };
    this.isInit = false;
    this.setEdit(false, "");
    this.setNode();
  }

  updateNodeInfo = () => {
    if (this.infoLock) return;
    this.infoLock = true;
    const vm = this;
    setTimeout(function () {
      let selectedNode = window.minder.getSelectedNode();
      if (selectedNode !== null) {
        vm.nodeInfo = {
          id: selectedNode.data.id,
          text: selectedNode.data.text,
          note: selectedNode.data.note,
          hyperlink: {
            url: selectedNode.data.hyperlink,
            title: selectedNode.data.hyperlinkTitle,
          },
          nodeLink: selectedNode.data.nodeLink,
          image: {
            url: selectedNode.data.image,
            title: "",
          },
          background: selectedNode.data.background,
          timeStamp: String(new Date().getTime()),
        };
      } else {
        vm.nodeInfo = {
          id: "",
          text: "",
          note: "",
          hyperlink: {},
          nodeLink: "",
          image: {},
          background: "",
          timeStamp: String(new Date().getTime()),
        };
        window.editor.hotbox.idle();
      }
      // vm.setIsNode();
      vm.setNode();
      vm.infoLock = false;
    });
  };

  updateNote = (value) => {
    this.nodeInfo.note = value;
    this.setNode();
  };

  setListenDisable = (value) => {
    this.listenDisable = value;
  };

  setEdit = (isEdit, text) => {
    this.isEdit = isEdit;
    // this.editText = text;
    if (isEdit) {
      this.props.handleChange(text);
    }

    // document.getElementById('node-input-container').value = text;
    // this._EditorMode.set({ isEdit: isEdit, editText: text });
  };

  setNode = () => {
    this.props.handleState("nodeInfo", this.nodeInfo);
  };

  setIsNode = () => {
    this.props.handleState("isNode", this.isNode);
  };

  setIsRoot = () => {
    // const selectedNode = window.minder.getSelectedNode();
    // this.isRoot = selectedNode && isNull(selectedNode.parent);
  };
}

export default Runtime;
