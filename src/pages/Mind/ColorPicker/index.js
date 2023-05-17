import * as React from "react";
import "./style.less";
import config from "../../../constant/config.minder";
import { partial } from "lodash";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { set } = this.props;
    return (
      <div className="colorpicker-container">
        <div>主题颜色</div>
        <div>
          {config.commonColor.map((citem, cindex) => {
            return (
              <div key={cindex} className={cindex == 0 ? "" : "color-line"}>
                {citem.map((item, index) => {
                  return (
                    <span
                      key={String(cindex) + "_" + String(index)}
                      className="color-item"
                      onClick={partial(set, item)}
                      style={{ backgroundColor: item }}
                    ></span>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div>标准颜色</div>
        <div>
          {config.standardColor.map((item, index) => {
            return (
              <span
                key={index}
                className="color-item"
                onClick={partial(set, item)}
                style={{ backgroundColor: item }}
              ></span>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
