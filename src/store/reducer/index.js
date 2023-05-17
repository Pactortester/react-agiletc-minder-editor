import { combineReducers } from "redux";

const initialState = {
  // 节点信息
  nodeInfo: {
    id: "",
    text: "",
    note: "",
    hyperlink: {},
    image: {},
    timeStamp: String(new Date().getTime()),
  },
  // 是否有选中节点
  isNode: false,
  // 撤销
  hasRedo: false,
  // 重做
  hasUndo: false,
  // 工具箱的默认tab key
  toolboxTab: "review",
  // toolbox 是否可见
  toolbox: false,
  // 主题
  theme: "fresh-blue-compat",
  // 模板
  template: "",

  showTip: false, //是否显示结果文字
  curIndex: 0, // 当前处于第一条
  resultNum: 0, // 搜索结果共几条
};

const kityMinder = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_NODE":
      return {
        ...state,
        nodeInfo: action.nodeInfo,
      };
    case "NODE_ROOT":
      return {
        ...state,
        isNode: action.isNode,
      };
    case "UNDO":
      return {
        ...state,
        hasUndo: action.hasUndo,
      };
    case "REDO":
      return {
        ...state,
        hasRedo: action.hasRedo,
      };

    case "TOOLBOX-TAB":
      return {
        ...state,
        toolboxTab: action.toolboxTab,
      };
    case "TOOLBOX": {
      return {
        ...state,
        toolboxTab: action.toolboxTab,
        toolbox: action.toolbox,
      };
    }
    case "THEME": {
      return {
        ...state,
        theme: action.theme,
      };
    }
    case "TEMPLATE":
      return {
        ...state,
        template: action.template,
      };

    case "SET_DATA":
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

export default combineReducers({
  kityMinder,
});
