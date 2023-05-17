import * as editorCommand from "./../command/EditorCommand";
import "hotbox-ui";
import "hotbox-ui/hotbox.css";

class HotBoxs {
  constructor(props) {
    this.setProps(props);

    this.hotbox = new window.HotBox("#kityminder-core");
    var main = this.hotbox.state("main");

    const vm = this;

    if (!props.state.readOnly) {
      main.button({
        position: "center",
        action: function () {
          // 编辑动作
          window.editor.runtime.handleEdit();
        },
        label: "编辑",
        key: "F2",
        next: "idle",
      });

      main.button({
        position: "ring",
        action: function () {
          editorCommand.handleUp();
        },
        label: "前移",
        key: "Alt+Up",
        next: "idle",
      });

      main.button({
        position: "ring",
        action: function () {
          window.editor.runtime.handleAppend("childNode");
        },
        label: "下级",
        key: "Tab",
        next: "idle",
      });

      main.button({
        position: "ring",
        action: function () {
          window.editor.runtime.handleAppend("siblingNode");
        },
        label: "同级",
        key: "Enter",
        next: "idle",
      });

      main.button({
        position: "ring",
        action: function () {
          editorCommand.handleDown();
        },
        label: "后移",
        key: "Alt+Down",
        next: "idle",
      });

      main.button({
        position: "ring",
        action: function () {
          editorCommand.handleRemove();
        },
        label: "删除",
        key: "Delete",
        next: "idle",
      });

      main.button({
        position: "ring",
        action: function () {
          window.editor.runtime.handleAppend("parentNode");
        },
        label: "上级",
        key: "Shift+Tab",
        next: "idle",
      });

      main.button({
        position: "bottom",
        action: function () {
          props.handleState("toolbox", true);
          props.handleState("toolboxTab", "note");
        },
        label: "备注",
        key: "备注",
        next: "idle",
      });
    } else {
      main.button({
        position: "ring",
        action: function () {
          vm.handleExecuteResult(2);
        },
        label: "通过",
        key: "通过",
        next: "idle",
      });

      main.button({
        position: "ring",
        action: function () {
          vm.handleExecuteResult(1);
        },
        label: "失败",
        key: "失败",
        next: "idle",
      });

      main.button({
        position: "ring",
        action: function () {
          vm.handleExecuteResult(4);
        },
        label: "不适用",
        key: "不适用",
        next: "idle",
      });

      main.button({
        position: "ring",
        action: function () {
          vm.handleExecuteResult(3);
        },
        label: "阻塞",
        key: "阻塞",
        next: "idle",
      });

      main.button({
        position: "top",
        action: function () {
          vm.handleExecuteResult(0);
        },
        label: "移除",
        key: "Del",
        next: "idle",
      });
    }
  }

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

  active = (x, y) => {
    this.hotbox.active("main", { x, y });
  };

  idle = () => {
    this.hotbox.active("idle");
  };

  setProps = (props) => {
    this.props = props;
  };
}

export default HotBoxs;
