import * as React from "react";
import { Modal } from "antd";
import {} from "lodash";
import "./style.less";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <React.Fragment>
        <span
          onClick={() => {
            this.setState({ visible: true });
          }}
          className="shotcut-icon"
        >
          {this.props.children}
        </span>
        <Modal
          title="快捷键"
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
          wrapClassName="shotcutModal"
          bodyStyle={{ height: 400, overflow: "scroll" }}
        >
          <h3>节点操作</h3>
          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Enter</span>
            </span>
            <span className="description">插入兄弟节点</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Tab</span>
            </span>
            <span className="description">插入子节点</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Shift</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">Tab</span>
            </span>
            <span className="description">插入父节点</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Delete</span>
            </span>
            <span className="description">删除节点</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Up</span>
              &nbsp;,&nbsp;
              <span className="shotcut-key">Down</span>
              &nbsp;,&nbsp;
              <span className="shotcut-key">Left</span>
              &nbsp;,&nbsp;
              <span className="shotcut-key">Right</span>
            </span>
            <span className="description">节点导航</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Alt</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">Up</span>
              &nbsp;,&nbsp;
              <span className="shotcut-key">Down</span>
            </span>
            <span className="description">向上/下调整顺序</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">/</span>
            </span>
            <span className="description">展开/收起节点</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">F2</span>
            </span>
            <span className="description">编辑文本</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Alt</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">Enter</span>
            </span>
            <span className="description">文本换行</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Ctrl</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">K</span>
            </span>
            <span className="description">链接-网页</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Ctrl</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">A</span>
            </span>
            <span className="description">全选节点</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Shift</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">鼠标左键</span>
            </span>
            <span className="description">选中兄弟节点</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Ctrl</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">C</span>
            </span>
            <span className="description">复制节点</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Ctrl</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">X</span>
            </span>
            <span className="description">剪切节点</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Ctrl</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">V</span>
            </span>
            <span className="description">粘贴节点</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Ctrl</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">F</span>
            </span>
            <span className="description">查找节点</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Ctrl</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">1</span>
              &nbsp;,&nbsp;
              <span className="shotcut-key">2</span>
              &nbsp;,&nbsp;
              <span className="shotcut-key">3</span>
            </span>
            <span className="description">添加前置条件,执行步骤, 预期结果</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Ctrl</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">0</span>
              &nbsp;,&nbsp;
              <span className="shotcut-key">1</span>
              &nbsp;,&nbsp;
              <span className="shotcut-key">2</span>
            </span>
            <span className="description">
              (执行任务)添加执行结果清除,✅，❎
            </span>
          </div>

          <h3>视野控制</h3>
          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Alt</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">拖动</span>
              &nbsp;,&nbsp;
              <span className="shotcut-key">右键拖动</span>
            </span>
            <span className="description">拖动视野</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">滚轮</span>
              &nbsp;,&nbsp;
              <span className="shotcut-key">触摸板</span>
            </span>
            <span className="description">移动视野</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">双击空白处</span>
            </span>
            <span className="description">居中根节点</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Ctrl</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">+</span>
              &nbsp;,&nbsp;
              <span className="shotcut-key">-</span>
            </span>
            <span className="description">放到/缩小视野</span>
          </div>

          <h3>布局</h3>
          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Ctrl</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">Shift</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">L</span>
            </span>
            <span className="description">整理布局</span>
          </div>

          <h3>后悔药</h3>
          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Ctrl</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">Z</span>
            </span>
            <span className="description">撤销</span>
          </div>

          <div className="shortcut-group">
            <span className="shotcut">
              <span className="shotcut-key">Ctrl</span>
              &nbsp;+&nbsp;
              <span className="shotcut-key">Y</span>
            </span>
            <span className="description">重做</span>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default App;
