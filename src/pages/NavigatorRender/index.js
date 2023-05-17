import * as React from "react";
import "./style.less";
import { partial } from "lodash";
import * as editorCommand from "../../command/EditorCommand";
import config from "./../../constant/config.minder";
import { Icon } from "antd";

// interface IProps {
//     zoom: number,
//     triggerActive: boolean,
//     fullScreen: boolean
// }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.height = 70; // 缩放条的长度
    this.state = {
      handActive: false,
      realFullScreen: false,
    };
  }

  zoomIn = () => {
    editorCommand.zoomIn();
  };

  getHeight = (value) => {
    const zoomList = config.zoom;
    const maxZoom = zoomList[zoomList.length - 1];
    const minZoom = zoomList[0];
    return (this.height * (maxZoom - value)) / (maxZoom - minZoom);
  };

  zoom = (value) => {
    editorCommand.zoom(value);
  };

  zoomOut = () => {
    editorCommand.zoomOut();
  };

  handClick = () => {
    this.setState({ handActive: !this.state.handActive });
    editorCommand.hand();
  };

  triggerClick = () => {
    window.editor.navigator.handleTriggerClick();
  };

  fullScreenClick = () => {
    if (this.props.fullScreen || document.fullscreenElement) {
      this.closeFullScreen();
    } else {
      this.fullScreen();
    }
  };

  fullScreen = () => {
    if (document.getElementsByTagName("body")[0].requestFullscreen) {
      // 如果浏览器不支持屏幕全屏
      this.setState({ realFullScreen: true });
      document.getElementsByTagName("body")[0].requestFullscreen();
      window.addEventListener("resize", this.reflashFullScreen, false);
    }
    window.editor.navigator.fullScreen = true;
  };

  reflashFullScreen = () => {
    this.setState({ realFullScreen: !!document.fullscreenElement });
    if (!document.fullscreenElement) {
      window.editor.navigator.fullScreen = false;
      window.removeEventListener("resize", this.reflashFullScreen);
    }
  };

  closeFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      this.setState({ realFullScreen: false });
    }
    window.editor.navigator.fullScreen = false;
  };

  render() {
    const { handActive, realFullScreen } = this.state;
    const { zoom, triggerActive, fullScreen } = this.props;
    return (
      <div className="navigator-container">
        <Icon
          type={fullScreen || realFullScreen ? "fullscreen-exit" : "fullscreen"}
          className="nav-icon"
          onClick={partial(this.fullScreenClick)}
        />
        <div className="nav-btn" onClick={partial(this.zoomIn)}>
          <i className="zoom-in icon" />
        </div>
        <div className="zoom-pan" style={{ height: this.height }}>
          <div
            className="origin"
            style={{ transform: "translate(0, " + this.getHeight(100) + "px)" }}
            onClick={partial(this.zoom, 100)}
          ></div>
          <div
            className="indicator"
            style={{
              transform: "translate(0, " + this.getHeight(zoom) + "px)",
              transition: "transform 200ms",
            }}
          ></div>
        </div>
        <div className="nav-btn" onClick={partial(this.zoomOut)}>
          <i className="zoom-out icon" />
        </div>
        <div
          className={handActive ? "nav-btn active" : "nav-btn"}
          onClick={partial(this.handClick)}
        >
          <i className="hand icon" />
        </div>
        <div className="nav-btn" onClick={partial(editorCommand.cameraRoot)}>
          <i className="camera icon" />
        </div>
        <div
          className={triggerActive ? "nav-btn active" : "nav-btn"}
          onClick={partial(this.triggerClick)}
        >
          <i className="trigger icon" />
        </div>
        <div
          id="nav-previewer"
          className="nav-previewer"
          style={{ display: triggerActive ? "block" : "none" }}
        ></div>
      </div>
    );
  }
}

export default App;
