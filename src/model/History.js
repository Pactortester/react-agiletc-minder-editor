import * as editorCommand from "./../command/EditorCommand";
import { compare } from "../common/helpers/jsondiff";
import { isUndefined } from "lodash";

class History {
  // 构造函数
  constructor(props) {
    // true代表这个是一个同步过来的动作 我在前端改变的时候 不需要发送patch
    this.isSync = false;
    this.setProps(props);
    this.hasUndo = false;
    this.hasRedo = false;
    this.reset();
    window.minder.on("contentchange", () => {
      this.change();
    });

    // 如果新导入一个脑图，就重置所有的undo以及redo
    window.minder.on("import", (e) => {
      this.reset();
    });
  }

  setProps = (props) => {
    this.props = props;
  };

  reset() {
    this.lastContent = editorCommand.exportJson();
    this.undoList = [];
    this.setUndo();
    this.redoList = [];
    this.setRedo();
  }

  makeUndoDiff() {
    var headSnap = editorCommand.exportJson();
    var diff = compare(headSnap, this.lastContent);
    if (diff.length) {
      this.undoList.push(diff);
      this.setUndo();
      while (this.undoList.length > this.MAX_HISTORY) {
        this.undoList.shift();
      }
      this.lastContent = headSnap;
      return true;
    }
    return false;
  }

  makeRedoDiff() {
    var revertSnap = editorCommand.exportJson();
    let diff = compare(revertSnap, this.lastContent);
    this.redoList.push(diff);
    this.setRedo();
    this.lastContent = revertSnap;
  }

  /**
   * 生成这次操作与上次的区别的diff内容
   */
  makePatch = () => {
    var headSnap = editorCommand.exportJson();
    if (!isUndefined(this.lastContent.root.data.text)) {
      var diff = compare(this.lastContent, headSnap);
      if (diff.length) {
        if (!this.isSync) {
          this.props.sendPatch(diff);
        } else {
          this.isSync = false;
        }
      }
    }
  };

  setUndo = () => {
    this.hasUndo = !!this.undoList.length;
    this.props.handleState("hasUndo", this.hasUndo);
  };

  setRedo = () => {
    this.hasRedo = !!this.redoList.length;
    this.props.handleState("hasRedo", this.hasRedo);
  };

  undo() {
    this.patchLock = true;
    var undoDiff = this.undoList.pop();
    this.setUndo();
    if (undoDiff) {
      this.props.sendPatch(undoDiff);
      editorCommand.applyPatches(undoDiff);
      this.makeRedoDiff();
    }
    this.patchLock = false;
  }

  redo() {
    this.patchLock = true;
    var redoDiff = this.redoList.pop();
    this.setRedo();
    if (redoDiff) {
      this.props.sendPatch(redoDiff);
      editorCommand.applyPatches(redoDiff);
      this.makeUndoDiff();
    }
    this.patchLock = false;
  }

  change() {
    if (this.patchLock) return;
    this.makePatch();
    if (this.makeUndoDiff()) {
      this.redoList = [];
      this.setRedo();
    }
  }

  hasUndo() {
    return !!this.undoList.length;
  }

  hasRedo() {
    return !!this.redoList.length;
  }
}

export default History;
