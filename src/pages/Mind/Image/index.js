import * as React from "react";
import "./style.less";
import { Modal, Form, Upload, Button, notification, message } from "antd";
import { partial, isUndefined } from "lodash";
import * as editorComand from "../../../command/EditorCommand";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentWillReceiveProps = (nextProps) => {};

  componentWillMount() {}

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      editorComand.handleImage(values);
      const { nodeInfo } = this.props;
      nodeInfo.image = values;
      // this._EditorMode.set({ nodeInfo: nodeInfo });
      this.onCancel();
      setTimeout(() => {
        window.minder.fire("contentchange");
      }, 500);
    });
  };

  onCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel(false);
  };

  handleFocus = (value) => {
    window.editor.runtime.setListenDisable(value);
  };

  render() {
    const { loading } = this.state;
    const { visible, nodeInfo, uploadUrl } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } =
      this.props.form;
    const props = {
      name: "file",
      showUploadList: false,
      accept: "image/*",
      action: uploadUrl,
      data: (file) => {
        var formData = {};
        formData["file"] = file;
        return formData;
      },
      beforeUpload: (file) => {
        if (file.type.indexOf("image") == -1) {
          message.warning("仅允许上传图片");
          return false;
        } else {
          return true;
        }
      },
      onChange: (info) => {
        this.setState({ loading: true });
        const status = info.file.status;
        if (status !== "uploading") {
          this.setState({ loading: false });
        }
        if (status === "done") {
          setFieldsValue({ url: info.file.response.data[0].url });
        } else if (status === "error") {
          notification.error({
            message: "提示",
            description: "图片上传失败！",
            duration: 4,
          });
        }
      },
    };
    return (
      <Modal
        className="image-container"
        title="图片"
        visible={visible}
        onOk={this.handleOk}
        okText="确定"
        onCancel={partial(this.onCancel)}
        cancelText="取消"
      >
        <Form>
          <Form.Item
            label={
              <span>
                图片
                <span style={{ color: "#F4A460" }}>（仅支持jpg、png图片）</span>
              </span>
            }
          >
            {getFieldDecorator("url", {
              initialValue: nodeInfo.image.url,
              trigger: "",
              rules: [{ required: true, message: "请选择图片" }],
            })(
              <Upload {...props}>
                <Button loading={loading} icon="upload">
                  {" "}
                  点击上传
                </Button>
              </Upload>
            )}
          </Form.Item>
        </Form>
        {!isUndefined(getFieldValue("url")) && (
          <img className="ui-logo" src={getFieldValue("url")} />
        )}
      </Modal>
    );
  }
}

export default Form.create()(App);
