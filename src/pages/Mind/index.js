import * as React from "react";
import {
  Icon,
  Menu,
  Dropdown,
  Popover,
  Tooltip,
  Button,
  Select,
  Tag,
} from "antd";
import "./style.less";
import { partial, isEmpty, isUndefined, isString } from "lodash";
import * as editorCommand from "../../command/EditorCommand";
import HyperLink from "./HyperLink";
import NodeLink from "./NodeLink";
import ImageUpload from "./Image";
import ColorPicker from "./ColorPicker";

const { Option } = Select;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hyperlink: false,
      nodeLink: false,
      image: false,
      fontColor: "#000",
      bgColor: "rgb(115, 161, 191)",
      hasNodeSelected: false,
      nodeInfo: {
        hyperlink: "",
      },
      currentResource: [],
      image: false,
    };
  }

  componentDidMount = () => {
    this.props.onRef(this);
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.nodeInfo.id !== this.props.nodeInfo.id) {
      nextProps.handleState("usedResource", window.minder.getUsedResource());
      this.setState({
        currentResource: nextProps.isNode
          ? editorCommand.getResource() === null
            ? []
            : editorCommand.getResource()
          : [],
      });
    }
  };

  setHyperlink = (visible) => {
    this.setState({
      hyperlink: visible,
    });
  };

  setNodeLink = (visible) => {
    this.setState({
      nodeLink: visible,
    });
  };

  setImage = (visible) => {
    this.setState({ image: visible });
  };

  handleHyperlink = () => {
    editorCommand.handleHyperlink({ url: null, title: "" });
    //更新其中的值
    // window.editor.runtime.nodeInfo = { url: null, title: '' };
  };

  handleNodeLink = () => {
    editorCommand.handleNodeLink("");
  };

  handlePriority = (value) => {
    editorCommand.handlePriority(value);
  };

  /**
   * 设置背景颜色
   * @param {*} color
   */
  setBgColor = (color) => {
    // if (!this.props.editable) return;
    this.setState({ bgColor: color });
    editorCommand.handleBgColor(color);
  };

  /**
   * 设置字体颜色
   * @param {}} color
   */
  setFontColor = (color) => {
    this.setState({ fontColor: color });
    editorCommand.handleForeColor(color);
  };

  /**
   * 标签发生变化时
   */
  onTagChange = (value) => {};

  /**
   * 清除样式
   */
  handleClear = () => {
    editorCommand.handleClear();
  };

  onTagSelect = (value) => {
    let temp = JSON.parse(JSON.stringify(this.state.currentResource));
    let isMatch = false;
    for (const item of temp) {
      let name = isString(item) ? item : item.name;
      isMatch = value == name || value.name == name;
      if (isMatch) {
        break;
      }
    }

    if (isMatch) {
      this.onTagDeSelect(value);
    } else {
      temp.push(value);
      editorCommand.handleResource(value, 0);
      this.setState({
        currentResource: temp,
      });
    }

    // if (this.state.usedResource.indexOf(value) === -1) {
    //     let temp = JSON.parse(JSON.stringify(this.state.usedResource));
    //     temp.push(value);
    //     this.setState({
    //         currentResource: temp
    //     })
    // }
  };

  onTagDeSelect = (value) => {
    let temp = JSON.parse(JSON.stringify(this.state.currentResource));
    temp = temp.filter((item) => {
      if (isString(value)) {
        return item !== value && item.name !== value;
      } else {
        return item !== value.name && item.name !== value.name;
      }
    });
    editorCommand.handleResource(value, 1);
    this.setState({
      currentResource: temp,
    });
  };

  onTagFouce = () => {};

  renderTags = () => {
    const { isNode, tags } = this.props;
    if (!isUndefined(window.minder)) {
      return tags.map((item) => {
        let color = window.minder.getResourceColor(item).toHEX();
        return (
          <Tag
            style={{ cursor: "pointer" }}
            onClick={() => {
              this.onTagSelect(item);
            }}
            className={`resource-tag ${isNode ? "" : "disabled"}`}
            color={color}
          >
            {item}
          </Tag>
        );
      });
    }
  };

  setSearch = (visible) => {
    this.props.handleState("searchDrawerVisible", visible);
  };

  handleImage = () => {
    editorCommand.handleImage({ url: null, title: "" });
    setTimeout(() => {
      window.minder.fire("contentchange");
    }, 500);
  };

  /**
   * 打开备注
   */
  setNote = () => {
    this.props.handleState("toolbox", true);
    this.props.handleState("toolboxTab", "note");
  };

  /**
   * 设置执行结果
   * @param {*} key
   */
  handleExecuteResult = (key) => {
    editorCommand.handleExecutor(key === 0 ? "" : this.props.userName);
    editorCommand.handleResult(key);
    if (this.props.onResultChange) {
      this.props.onResultChange();
    }
  };

  render() {
    const { isNode, nodeInfo, hasUndo, hasRedo } = this.props;

    const { hyperlink, image, fontColor, bgColor, nodeLink } = this.state;

    var priorityList = [];
    for (let i = 0; i < 3; i++) {
      priorityList.push(
        <Button
          disabled={!isNode}
          onClick={partial(this.handlePriority, i + 1)}
          type="link"
          size="small"
          className={"priority-btn p" + String(i + 1)}
        >
          P{i}
        </Button>
      );
    }

    // const addChild = () => {
    //     return <svg t="1635772918855" viewBox="0 0 1056 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1498" width="1em" height="1em"><path d="M177.202253 262.79646h90.619469v675.115044h-90.619469z" p-id="1499" fill="#595959"></path><path d="M199.85712 847.292035h371.539823v90.619469H199.85712zM571.396943 104.212389h226.548672v90.619469h-226.548672z" p-id="1500" fill="#595959"></path><path d="M643.892518 36.247788h90.619469v226.548672h-90.619469zM526.087208 303.575221H0.494288V0h521.061947v303.575221z m-434.973451-90.619469h339.823009V90.619469H91.113757v122.336283zM1029.025261 1024H503.432341v-303.575221h521.061947v303.575221z m-434.973451-90.619469h339.823009v-122.336283h-339.823009v122.336283z" p-id="1501" fill={isNode ? '#595959' : '#d9d9d9'}></path></svg>
    // }

    // const addParent = () => {
    //     return <svg t="1635780580729" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3552" width="1em" height="1em"><path d="M46.545455 269.963636h93.090909v693.527273H46.545455z" p-id="3553" fill="#595959"></path><path d="M107.054545 870.4h144.29091v93.090909H107.054545zM772.654545 833.163636h232.727273v93.090909h-232.727273z" p-id="3554" fill="#595959"></path><path d="M842.472727 763.345455h93.090909v232.727272h-93.090909zM535.272727 311.854545H0V0h535.272727v311.854545zM93.090909 218.763636h349.090909V93.090909H93.090909v125.672727zM740.072727 1024H218.763636v-311.854545h521.309091V1024z m-432.872727-93.090909H651.636364v-125.672727H307.2V930.909091z" p-id="3555" fill={isNode ? '#595959' : '#d9d9d9'}></path></svg>
    // }

    // const addSibling = () => {
    //     return <svg t="1635780669946" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3757" width="1em" height="1em"><path d="M246.690909 237.381818h93.090909v572.509091h-93.090909zM754.036364 837.818182h232.727272v93.090909h-232.727272z" p-id="3758" fill="#595959"></path><path d="M823.854545 768h93.09091v232.727273h-93.09091zM572.509091 311.854545H37.236364V0h535.272727v311.854545z m-442.181818-93.090909h349.090909V93.090909H130.327273v125.672727zM563.2 1024H23.272727v-311.854545H558.545455V1024z m-446.836364-93.090909H465.454545v-125.672727H116.363636V930.909091z" p-id="3759" fill={isNode ? '#595959' : '#d9d9d9'}></path></svg>
    // }

    const hyperlinkMenu = (
      <Menu>
        <Menu.Item>
          <a onClick={partial(this.setHyperlink, true)}>
            {isEmpty(nodeInfo.hyperlink) || isEmpty(nodeInfo.hyperlink.url)
              ? "插入超链接"
              : "打开超链接"}
          </a>
        </Menu.Item>
        {isEmpty(nodeInfo.hyperlink) ||
        isEmpty(nodeInfo.hyperlink.url) ? null : (
          <Menu.Item>
            <a onClick={partial(this.handleHyperlink)}>移除超链接</a>
          </Menu.Item>
        )}

        <Menu.Item>
          <a onClick={partial(this.setNodeLink, true)}>
            {isEmpty(nodeInfo.nodeLink) ? "插入主题链接" : "打开主题链接"}
          </a>
        </Menu.Item>

        {isEmpty(nodeInfo.nodeLink) ? null : (
          <Menu.Item>
            <a onClick={partial(this.handleNodeLink)}>移除主题链接</a>
          </Menu.Item>
        )}
      </Menu>
    );

    const imageMenu = isEmpty(nodeInfo.image) ? (
      <Menu>
        <Menu.Item>
          <a onClick={partial(this.setImage, true)}>插入图片</a>
        </Menu.Item>
      </Menu>
    ) : (
      <Menu>
        <Menu.Item>
          <a onClick={partial(this.setImage, true)}>打开图片</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={partial(this.handleImage)}>移除图片</a>
        </Menu.Item>
      </Menu>
    );

    const commentMenu = (
      <Menu>
        <Menu.Item>
          <a onClick={partial(this.setNote, true)}>打开备注</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div
        className="minder-container"
        style={{ height: this.props.expand ? "80px" : "0px" }}
      >
        <div className="inline" style={{ width: 70 }}>
          <Button
            onClick={() => {
              window.editor.history.undo();
            }}
            type="link"
            icon="left-circle"
            size="small"
            disabled={!hasUndo}
          >
            撤销
          </Button>
          <Button
            onClick={() => {
              window.editor.history.redo();
            }}
            type="link"
            icon="right-circle"
            size="small"
            disabled={!hasRedo}
          >
            重做
          </Button>
        </div>
        {/* {
                    this.props.readOnly ? null : <div className='inline' style={{ width: 200 }}>
                        <Button
                            type='link'
                            size='small'
                            disabled={!isNode}
                            onClick={() => { window.editor.runtime.handleAppend("childNode"); }}
                        >
                            <Icon component={addChild}></Icon>
                            插入下级
                        </Button>
                        <Button
                            type='link'
                            size='small'
                            disabled={!isNode}
                            onClick={() => { window.editor.runtime.handleAppend("parentNode"); }}
                        >
                            <Icon component={addParent}></Icon>
                            插入上级
                        </Button>
                        <Button
                            type='link'
                            size='small'
                            disabled={!isNode}
                            onClick={() => { window.editor.runtime.handleAppend("siblingNode"); }}
                        >
                            <Icon component={addSibling}></Icon>
                            插入同级
                        </Button>
                    </div>
                } */}

        {
          /* <div className='inline' style={{ width: 64 }}>
                    <Button
                        onClick={() => {
                            editorCommand.handleUp();
                        }}
                        type='link'
                        icon='arrow-up'
                        size='small'
                        disabled={!isNode}
                    >
                        上移
                    </Button>
                    <Button
                        onClick={() => {
                            editorCommand.handleDown();
                        }}
                        type='link'
                        icon='arrow-down'
                        size='small'
                        disabled={!isNode}
                    >
                        下移
                    </Button>
                </div>


                 */
          // <Dropdown overlay={caseReviewMeun} trigger={['click']} disabled={!isNode}>
          //             <Button
          //                 type='link'
          //                 size='small'
          //                 className='big-icon'
          //             >
          //                 <Icon style={{ fontSize: "1.6em" }} type="file-text" />
          //                 <br />
          //                 评审
          //                 <Icon type="down" />
          //             </Button>
          //         </Dropdown>
        }

        <div className="inline" style={{ textAlign: "center", width: 200 }}>
          {!this.props.readOnly ? null : (
            <Dropdown
              overlay={commentMenu}
              trigger={["click"]}
              disabled={!isNode}
            >
              <Button type="link" size="small" className="big-icon">
                <Icon style={{ fontSize: "1.6em" }} type="file-text" />
                <br />
                备注
                <Icon type="down" />
              </Button>
            </Dropdown>
          )}

          <Dropdown
            overlay={hyperlinkMenu}
            trigger={["click"]}
            disabled={!isNode}
          >
            <Button type="link" size="small" className="big-icon">
              <Icon style={{ fontSize: "1.6em" }} type="link" />
              <br />
              链接
              <Icon type="down" />
            </Button>
          </Dropdown>
          {
            <Dropdown
              overlay={imageMenu}
              trigger={["click"]}
              disabled={!isNode}
            >
              <Button type="link" size="small" className="big-icon">
                <Icon style={{ fontSize: "1.6em" }} type="picture" />
                <br />
                图片
                <Icon type="down" />
              </Button>
            </Dropdown>
          }
        </div>
        {
          // 执行用例的结果
          this.props.readOnly ? (
            <div className="inline" style={{ width: 150 }}>
              <Tooltip placement="top" title={"移除结果"}>
                <Button
                  onClick={() => {
                    this.handleExecuteResult(0);
                  }}
                  type="link"
                  style={{ padding: "0px 3px" }}
                >
                  <i
                    aria-label="图标: minus-circle"
                    className="anticon anticon-minus-circle"
                    style={{ fontSize: "18px", color: "rgba(0, 0, 0, 0.6)" }}
                  >
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      className=""
                      data-icon="minus-circle"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm192 472c0 4.4-3.6 8-8 8H328c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h368c4.4 0 8 3.6 8 8v48z"></path>
                    </svg>
                  </i>
                </Button>
              </Tooltip>

              <Tooltip placement="top" title={"失败"}>
                <Button
                  onClick={() => {
                    this.handleExecuteResult(1);
                  }}
                  type="link"
                  style={{ padding: "0px 3px" }}
                >
                  <i
                    aria-label="图标: fail"
                    className="anticon anticon-fail"
                    style={{ width: "18px", height: "18px" }}
                  >
                    <svg
                      viewBox="0 0 1024 1024"
                      width="18"
                      height="18"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 512A512 512 0 1 0 512 0 512 512 0 0 0 0 512z"
                        fill="#FFED83"
                        fillOpacity="1"
                        data-spm-anchor-id="a313x.7781069.0.i41"
                      ></path>
                      <path
                        d="M782.826255 253.254397a37.559846 37.559846 0 0 1 0 51.727156l-465.48949 465.599314a36.571429 36.571429 0 0 1-51.727155-51.727156l465.489489-465.599314a37.559846 37.559846 0 0 1 51.727156 0z"
                        fill="#d81e06"
                        fillOpacity="1"
                        data-spm-anchor-id="a313x.7781069.0.i44"
                      ></path>
                      <path
                        d="M265.554698 253.254397a37.559846 37.559846 0 0 1 51.727155 0l465.48949 465.48949a36.571429 36.571429 0 0 1-51.727156 51.727155L265.554698 305.091377a37.559846 37.559846 0 0 1 0-51.83698z"
                        fill="#d81e06"
                        fillOpacity="1"
                        data-spm-anchor-id="a313x.7781069.0.i42"
                      ></path>
                    </svg>
                  </i>
                </Button>
              </Tooltip>
              <Tooltip placement="top" title={"通过"}>
                <Button
                  onClick={() => {
                    this.handleExecuteResult(2);
                  }}
                  type="link"
                  style={{ padding: "0px 3px" }}
                >
                  <i
                    aria-label="图标: checked"
                    className="anticon anticon-checked"
                    style={{ width: "18px", height: "18px" }}
                  >
                    <svg
                      viewBox="0 0 1024 1024"
                      width="18"
                      height="18"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M509.750303 514.249697m-509.750303 0a509.750303 509.750303 0 1 0 1019.500606 0 509.750303 509.750303 0 1 0-1019.500606 0Z"
                        fill="#6AC259"
                        fillOpacity="1"
                      ></path>
                      <path
                        d="M250.957576 537.05697a19.859394 19.859394 0 0 1 0-28.780606l28.780606-28.780606a19.859394 19.859394 0 0 1 28.780606 0l2.01697 2.094545 113.105454 121.250909a9.929697 9.929697 0 0 0 14.351515 0L713.69697 317.129697h2.094545a19.859394 19.859394 0 0 1 28.780606 0l28.780606 28.780606a19.859394 19.859394 0 0 1 0 28.780606l-328.921212 341.333333a19.859394 19.859394 0 0 1-28.780606 0L254.991515 543.030303z"
                        fill="#FFFFFF"
                        fillOpacity="1"
                      ></path>
                    </svg>
                  </i>
                </Button>
              </Tooltip>

              <Tooltip placement="top" title={"阻塞"}>
                <Button
                  onClick={() => {
                    this.handleExecuteResult(3);
                  }}
                  type="link"
                  style={{ padding: "0px 3px" }}
                >
                  <i
                    aria-label="图标: block"
                    className="anticon anticon-block"
                    style={{ width: "18px", height: "18px" }}
                  >
                    <svg
                      viewBox="0 0 1024 1024"
                      width="18"
                      height="18"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M512 1024A511.99872 511.99872 0 1 0 468.650775 1.794556 512.169386 512.169386 0 0 0 0.00128 512.00128a511.99872 511.99872 0 0 0 511.99872 511.99872z"
                        fill="#FFFFFF"
                        fillOpacity="1"
                      ></path>
                      <path
                        d="M512 938.66688A426.6656 426.6656 0 1 0 511.914667 85.250347 426.6656 426.6656 0 0 0 512 938.66688z"
                        fill="#d81e06"
                        fillOpacity="1"
                      ></path>
                      <path
                        d="M512 938.66688a426.6656 426.6656 0 0 0 426.6656-426.6656H85.3344a426.6656 426.6656 0 0 0 426.6656 426.6656z"
                        fill="#FFED83"
                        fillOpacity="1"
                        data-spm-anchor-id="a313x.7781069.0.i5"
                      ></path>
                    </svg>
                  </i>
                </Button>
              </Tooltip>

              <Tooltip placement="top" title={"不适用"}>
                <Button
                  onClick={() => {
                    this.handleExecuteResult(4);
                  }}
                  type="link"
                  style={{ padding: "0px 3px" }}
                >
                  <i
                    aria-label="图标: skip"
                    className="anticon anticon-skip"
                    style={{ width: "18px", height: "18px" }}
                  >
                    <svg
                      viewBox="0 0 1024 1024"
                      width="18"
                      height="18"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M747.3152 415.6416a256.0512 256.0512 0 0 0-489.472 96.768H341.504a170.6496 170.6496 0 0 1 327.6288-58.624l-115.0976 20.9408 227.84 116.736 48.2816-251.392-82.8416 75.5712zM0 512C0 229.2224 229.1712 0 512 0c282.7776 0 512 229.1712 512 512 0 282.7776-229.1712 512-512 512-282.7776 0-512-229.1712-512-512z"
                        fill="#BE96F9"
                        fillOpacity="1"
                        p-id="577"
                      ></path>
                    </svg>
                  </i>
                </Button>
              </Tooltip>
            </div>
          ) : null
        }

        {this.props.readOnly ? null : (
          <>
            <div className="inline" style={{ width: 120 }}>
              <li
                key={0}
                style={{ cursor: "pointer" }}
                onClick={partial(this.handlePriority, 0)}
                className={"km-priority-item2 priority-icon priority-0"}
              ></li>
              {priorityList}
            </div>

            <div className="inline" style={{ width: 45 }}>
              <div>
                <Button
                  onClick={partial(this.setFontColor, fontColor)}
                  style={{
                    color: fontColor,
                    marginRight: "2px",
                    padding: "0px 2px",
                  }}
                  type="link"
                  icon="font-colors"
                  size="small"
                  disabled={!isNode}
                ></Button>
                <Popover
                  placement="bottomLeft"
                  content={
                    <div>
                      <ColorPicker set={this.setFontColor} />
                    </div>
                  }
                >
                  <span className="m-icon">
                    <Icon
                      className={isNode ? "" : "icon-disabled"}
                      type="caret-down"
                    />
                  </span>
                </Popover>
              </div>
              <div>
                <Button
                  onClick={partial(this.setBgColor, bgColor)}
                  style={{ color: bgColor, marginRight: "2px" }}
                  type="link"
                  icon="bg-colors"
                  size="small"
                  disabled={!isNode}
                ></Button>
                <Popover
                  placement="bottomLeft"
                  content={<ColorPicker set={this.setBgColor} />}
                >
                  <span className="m-icon">
                    <Icon
                      className={isNode ? "" : "icon-disabled"}
                      type="caret-down"
                    />
                  </span>
                </Popover>
              </div>
            </div>

            <div className="inline" style={{ width: 80 }}>
              <Button
                disabled={!isNode}
                type="link"
                size="small"
                className="big-icon"
                onClick={partial(this.handleClear)}
              >
                <Icon style={{ fontSize: "1.2em" }} type="highlight" />
                <br />
                清除样式
              </Button>
            </div>
          </>
        )}

        <div className="inline" style={{ width: 50 }}>
          <Button
            type="link"
            size="small"
            className="big-icon"
            onClick={partial(this.setSearch, true)}
          >
            <Icon style={{ fontSize: "1.2em" }} type="search" />
            <br />
            搜索
          </Button>
        </div>
        {this.props.readOnly ? null : (
          <div style={{ marginLeft: 5 }}>
            <div
              style={{ display: "flex", alignItems: "center", marginTop: 5 }}
            >
              <div className="inline" style={{ width: 220 }}>
                {this.renderTags()}
              </div>

              <div className="inline" style={{ width: 220 }}>
                <Select
                  mode="tags"
                  size="small"
                  maxTagCount={1}
                  disabled={!isNode}
                  style={{ width: 200 }}
                  value={this.state.currentResource.filter(
                    (item) =>
                      typeof item === "string" &&
                      item !== "已审" &&
                      item !== "待审"
                  )}
                  onSelect={this.onTagSelect}
                  onDeselect={this.onTagDeSelect}
                  onChange={this.onTagChange}
                  placeholder="请输入/选择自定义标签"
                >
                  {!isNode ||
                    this.props.usedResource
                      .filter(
                        (item) =>
                          typeof item === "string" &&
                          item !== "已审" &&
                          item !== "待审"
                      )
                      .map((item) => {
                        return <Option key={item}>{item}</Option>;
                      })}
                </Select>
              </div>
            </div>
          </div>
        )}

        <HyperLink
          nodeInfo={nodeInfo}
          visible={hyperlink}
          onCancel={this.setHyperlink}
        />

        <NodeLink
          nodeInfo={nodeInfo}
          visible={nodeLink}
          onCancel={this.setNodeLink}
        ></NodeLink>

        <ImageUpload
          uploadUrl={this.props.uploadUrl}
          nodeInfo={nodeInfo}
          visible={image}
          onCancel={this.setImage}
        ></ImageUpload>
      </div>
    );
  }
}

export default App;
