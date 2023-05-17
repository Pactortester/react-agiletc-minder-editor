import { ActionModeBase } from "@/common/modes/Base/ActionModeBase";
import types from "@/app/constants/kityminderTypes";
import { fromJS } from "immutable";

export default class EditorMode extends ActionModeBase {
  // 获取项目列表
  async set(params) {
    const type = types.SET_STATE;
    this.dispatch({
      type: type,
      data: params,
    });
  }
}

const initialState = fromJS({
  loading: false,
  editable: true,
  isNode: false,
  isRoot: false,
  isEdit: false,
  editText: "",
  hasUndo: false,
  hasRedo: false,
  hotbox: false,
  toolbox: false,
  toolboxTab: "review",
  nodeInfo: {
    id: "",
    text: "",
    note: "",
    hyperlink: {},
    image: {},
    timeStamp: "",
  },
  zoom: 100,
  triggerActive: true,
  fullScreen: false,
  theme: "fresh-blue-compat",
  template: "",
  showTip: false, //是否显示结果文字
  curIndex: 0, // 当前处于第一条
  resultNum: 0, // 搜索结果共几条
  allResource: [], // 所有标签
  currentResource: [], // 当前选中节点的标签
  interfaceSettingVisible: false,
});

export function editorInfo(state = initialState, action) {
  const oldState = state.toJS();
  switch (action.type) {
    case types.SET_STATE:
      state = fromJS({ ...oldState, ...action.data });
      return state;
    default:
      return state;
  }
}
