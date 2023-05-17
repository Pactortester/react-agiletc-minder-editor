import { isEqual, unionWith, remove, isNull, isUndefined } from "lodash";
import $ from "jquery";
import marked from "marked/lib/marked";

class ToolBox {
  // 构造函数
  constructor(props) {
    this.setProps(props);

    this.toolbox = false;
    // 调起备注预览
    window.minder.on("shownoterequest", this.enterNotePreview);
    window.minder.on("hidenoterequest", () => clearTimeout(this.previewTimer));

    // 退出备注预览
    $("#kityminder-core").on(
      "mousedown mousewheel DOMMouseScroll",
      this.exitNotePreview
    );
  }

  /**
   *
   */
  setProps = (props) => {
    this.props = props;
  };

  enterNotePreview = (e) => {
    const vm = this;
    this.previewTimer = setTimeout(function () {
      vm.preview(e.node);
    }, 300);
  };

  exitNotePreview = (e) => {
    // 退出预览
    if (!this.previewLive) return;
    document.getElementById("note-previewer").style.display = "none";
  };

  setToolbox = (visible, tab) => {
    this.toolbox = visible;
    this.props.handleState("toolbox", this.toolbox);
    this.props.handleState("toolboxTab", tab);
    if (!visible) document.getElementById("kityminder-editor").focus();
  };

  preview = (node) => {
    let icon = node
      .getRenderer("NoteIconRenderer")
      .getRenderShape()
      .getRenderBox("screen");
    let note = node.getData("note");
    document.getElementById("note-preview-content").innerHTML = marked(note);
    let editors = document.getElementsByClassName("kityminder-editor");
    let x =
      icon.left -
      (document.documentElement.clientWidth - editors[0].clientWidth);
    let y = icon.bottom + 8 - editors[0].getBoundingClientRect().top;
    if (x < 0) x = 10;

    $("#note-previewer").css({
      left: Math.round(x),
      top: Math.round(y),
      display: "block",
    });
    this.previewLive = true;
  };
}

export default ToolBox;
