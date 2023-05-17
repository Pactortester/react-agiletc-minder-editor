import * as React from "react";
// import './style.less';
import { Modal, Form, Input } from "antd";
import { partial, isUndefined } from "lodash";
import * as editorCommand from "../../../command/EditorCommand";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      editorCommand.handleHyperlink(values);
      const { nodeInfo } = this.props;
      nodeInfo.hyperlink = values;
      this.onCancel();
    });
  };

  onCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel(false);
  };

  handleFocus = (value) => {
    // window.editor.runtime.setListenDisable(value);
  };

  render() {
    const { visible, nodeInfo } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 13 } };
    return (
      <Modal
        className="hyperlink-container"
        title="链接"
        visible={visible}
        onOk={this.handleOk}
        okText="确定"
        onCancel={partial(this.onCancel)}
        cancelText="取消"
      >
        <Form {...formItemLayout}>
          <Form.Item label="链接地址">
            {getFieldDecorator("url", {
              initialValue: isUndefined(nodeInfo.hyperlink.url)
                ? ""
                : nodeInfo.hyperlink.url,
              rules: [{ required: true, message: "请输入链接地址" }],
            })(
              <Input
                onFocus={partial(this.handleFocus, true)}
                placeholder="以http(s)://或ftp://开头"
              />
            )}
          </Form.Item>
          <Form.Item label="提示文本">
            {getFieldDecorator("title", {
              initialValue: isUndefined(nodeInfo.hyperlink.title)
                ? ""
                : nodeInfo.hyperlink.title,
            })(
              <Input
                onFocus={partial(this.handleFocus, true)}
                placeholder="鼠标在链接上悬停时提示的文本"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(App);
