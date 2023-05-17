import * as React from "react";
import "./style.less";
import { Icon, Popover, Divider, Menu, Dropdown } from "antd";
import * as editorComand from "../../command/EditorCommand";
import { partial } from "lodash";
import config from "../../constant/config.minder";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // window.editor['search'] = new Search(this.props);
  }

  setTemplate = (value) => {
    editorComand.handleTemplate(value);
    this.props.handleState("template", value);
  };

  setTheme = (value) => {
    editorComand.handleTheme(value);
    this.props.handleState("theme", value);
  };

  setSearch = (visible) => {
    this.props.handleState("searchDrawerVisible", visible);
  };

  render() {
    const { template, theme, minderStatus } = this.props;
    let editable = minderStatus === "normal";

    const templateMenu = (
      <div className="template-list">
        {config.template.map((item) => (
          <div
            key={item}
            className={
              template == item
                ? "selected inline-block-pointer"
                : "inline-block-pointer"
            }
            onClick={partial(this.setTemplate, item)}
          >
            <i
              className={
                "inline-block km-btn-item-template template-item " + item
              }
            />
          </div>
        ))}
      </div>
    );
    var themeMenu = [];
    for (var key in config.theme) {
      const item = config.theme[key];
      themeMenu.push(
        <div
          key={key}
          className="inline-block-pointer"
          onClick={partial(this.setTheme, key)}
        >
          <a
            className="theme-item"
            style={{
              color: item.color,
              background: item.background,
              borderRadius: item.radius,
            }}
          >
            {item.key}
          </a>
        </div>
      );
    }
    const expandMenu = (
      <Menu>
        <Menu.Item>
          <a onClick={partial(editorComand.handleExpand, 1)}>展开到一级节点</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={partial(editorComand.handleExpand, 2)}>展开到二级节点</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={partial(editorComand.handleExpand, 3)}>展开到三级节点</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={partial(editorComand.handleExpand, 4)}>展开到四级节点</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={partial(editorComand.handleExpand, 5)}>展开到五级节点</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={partial(editorComand.handleExpand, 6)}>展开到六级节点</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={partial(editorComand.handleExpand, 99)}>全部展开</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <div
        className="exterior-container"
        style={{ height: this.props.expand ? "60px" : "0px" }}
      >
        {editable && (
          <Popover placement="bottomLeft" content={templateMenu}>
            <div
              className={
                editable ? "inline-block" : "inline-block m-icon-disabled"
              }
            >
              <a className={"inline-block km-btn-item-template " + template} />
              <Icon className="caret" type="caret-down" />
            </div>
          </Popover>
        )}
        {editable || (
          <div className="inline-block">
            <div
              className={
                editable ? "inline-block" : "inline-block m-icon-disabled"
              }
            >
              <a className={"inline-block km-btn-item-template " + template} />
              <Icon className="caret" type="caret-down" />
            </div>
          </div>
        )}
        <Divider type="vertical" />
        {editable && (
          <Popover
            placement="bottom"
            content={<div className="theme-list">{themeMenu}</div>}
          >
            <div
              className={
                editable ? "inline-block" : "inline-block m-icon-disabled"
              }
              style={{ verticalAlign: "top" }}
            >
              <a
                className="theme-item"
                style={{
                  color: config.theme[theme].color,
                  background: config.theme[theme].background,
                  borderRadius: config.theme[theme].radius,
                }}
              >
                {config.theme[theme].key}
              </a>
              <Icon className="caret" type="caret-down" />
            </div>
          </Popover>
        )}
        <Divider type="vertical" />
        <Dropdown disabled={!editable} overlay={expandMenu}>
          <div
            className={
              editable ? "inline-block" : "inline-block m-icon-disabled"
            }
          >
            <a className="block km-btn-item expand" />
            <span>展开</span>
            <Icon className="caret" type="caret-down" />
          </div>
        </Dropdown>
        <Divider type="vertical" />
        <div
          className="inline-block-pointer"
          onClick={partial(editorComand.resetLayout)}
        >
          <i className="block km-btn-item reset-layout" />
          <span>整理布局</span>
        </div>
        <Divider type="vertical" />
        {this.props.type === "compare" ? (
          <div
            onClick={partial(this.setSearch, true)}
            className="inline-block-pointer"
          >
            <Icon
              className="block"
              style={{
                fontSize: "1.2em",
                verticalAlign: "middle",
                margin: "1px auto",
                padding: "2px",
                width: 20,
              }}
              type="search"
            />
            <span>搜索</span>
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
