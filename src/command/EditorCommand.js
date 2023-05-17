import { isEmpty, isUndefined, isNull } from "lodash";

/**
 * @desc 判断当前是否有节点选中
 * @param window.minder 思维导图实例
 *
 */
export function isNode() {
  return !!window.minder.getSelectedNode();
}

export function getSelectedNode() {
  return window.minder.getSelectedNode();
}

/**
 * 直接刷新当前的节点数据
 */
export function renderCurrentNode() {
  window.minder.getSelectedNode().render();
  window.minder.fire("contentchange");
}

/**
 * @desc 导入JSON
 * @param window.minder 思维导图实例
 * @param flag 是否第一次
 */
export function importJson(data, flag) {
  const currentNode = window.minder.getSelectedNode();

  window.minder.importJson(data);

  if (flag) {
    cameraRoot();
  }
  if (currentNode == null) {
    selectRoot();
  } else {
    window.minder.selectById(currentNode.getData("id"), true);
  }
}

/**
 * @desc 导出JSON
 * @param window.minder 思维导图实例
 *
 */
export function exportJson() {
  return window.minder.exportJson();
}

/**
 * @desc 选中根节点
 * @param window.minder 思维导图实例
 *
 */
export function selectRoot() {
  window.minder.select(window.minder.getRoot(), true);
}

/**
 * @desc 插入主题
 * @param window.minder 思维导图实例
 * @param type {string} 插入的主题类型
 */
export function handleAppend(type, text) {
  switch (type) {
    case "childNode":
      isNode() && window.minder.execCommand("AppendChildNode", text);
      break;
    case "parentNode":
      isNode() && window.minder.execCommand("AppendParentNode", text);
      break;
    case "siblingNode":
      isNode() && window.minder.execCommand("AppendSiblingNode", text);
      break;
    default:
      break;
  }
}

/**
 * @desc 编辑优先级
 * @param window.minder 思维导图实例
 * @param key {string} 优先级
 */
export function handlePriority(key) {
  isNode() && window.minder.execCommand("priority", key);
}

/**
 * @desc 编辑完成情况
 * @param window.minder 思维导图实例
 * @param key {string} 完成情况
 */
export function handleProgress(key) {
  isNode() && window.minder.execCommand("progress", key);
}

/**
 * 设置用例执行结果的情况
 * @param {}} key
 */
export function handleResult(key) {
  let indexTocommandValueMap = {
    0: 0, // 去掉结果
    1: 1, // 不通过
    2: 9, // 通过
    3: 5, // 阻塞
    4: 4, // 不执行
  };

  window.minder.execCommand("result", indexTocommandValueMap[parseInt(key)]);
}

/**
 * 更新节点的执行人
 * @param {*} name
 */
export function handleExecutor(name) {
  const nodes = window.minder.getSelectedNodes();
  for (const item of nodes) {
    item.setData("executor", name);
  }
}

/**
 * @desc 插入/移除文本
 * @param window.minder 思维导图实例
 * @param note {string} 备注信息
 */
export function handleText(text, nodeId) {
  window.minder.execCommand("text", text, nodeId);
}

/**
 * @desc 设置标签-非当前选中的节点
 * @param window.minder 思维导图实例
 * @param tag {string} 标签列表
 */
export function handleResourceById(tag, nodeId) {
  const nodes = window.minder.getNodesById(nodeId); // 注：此方法更新时貌似不触发contentChange事件，故注释
  !isEmpty(nodes) && nodes[0].setData("resource", tag).render();
  window.minder.layout(100);
  window.minder.fire("contentchange");
}

/**
 * @desc 设置标签-当前选中的节点
 * @param window.minder 思维导图实例
 * @param tag {string} 标签列表
 */
export function handleResource(tag, flag) {
  window.minder.execCommand("Resource", tag, flag);
}

/**
 * 获取选中节点的标签列表
 * @returns
 */
export function getResource() {
  return window.minder.queryCommandValue("resource");
}

/**
 * 获取所有的标签列表
 */
export function getAllResource() {
  return window.minder.getUsedResource();
}

/**
 * @desc 通过节点id获取当前节点的标签
 * @param window.minder 思维导图实例
 * @param tag {string} 标签列表
 */
export function getResourceById(nodeId) {
  const nodes = window.minder.getNodesById(nodeId);
  let resource = [];
  if (!isEmpty(nodes) && nodes[0].getData("resource"))
    resource = nodes[0].getData("resource");
  return resource;
}

/**
 * @desc 插入/移除备注
 * @param window.minder 思维导图实例
 * @param note {string} 备注信息
 */
export function handleNote(note, nodeId) {
  const currentNode = window.minder.getSelectedNode();
  window.minder.selectById(nodeId, true);
  window.minder.execCommand("Note", note);
  window.minder.selectById(
    isNull(currentNode) ? null : currentNode.getData("id"),
    true
  );

  /* window.minder.selectById(isNull(currentNode) ? null : currentNode.getData('id'), true);
    const nodes = window.minder.getNodesById(nodeId);
    !isEmpty(nodes) && nodes[0].setData('note', note).render();
    window.minder.layout(100); */
}

/**
 * @desc 获取备注
 * @param window.minder 思维导图实例
 * @param note {string} 备注信息
 */
export function getNote() {
  const note = window.minder.queryCommandValue("Note");
  if (isUndefined(note) || isNull(note)) {
    return "";
  }
  return note;
}

/**
 * @desc 获取文本
 * @param window.minder 思维导图实例
 * @param text {string} 文本
 */
export function getText() {
  return window.minder.queryCommandValue("Text");
}

/**
 * @desc 移除节点
 * @param window.minder 思维导图实例
 *
 */
let enable = true;
export function handleRemove() {
  const nodes = window.minder.getSelectedNodes();
  if (isEmpty(nodes)) return;
  enable = true;
  checkSourceId(nodes);
  enable && window.minder.execCommand("RemoveNode");
}

function checkSourceId(nodes) {
  nodes.map((node) => {
    if (!isNull(node.data.sourceId) && !isUndefined(node.data.sourceId)) {
      // message.error('所选节点或其子节点中包含关联接口，请先删除接口关联关系！');
      enable = false;
      return;
    }
    if (node.children !== []) {
      checkSourceId(node.children);
    }
  });
}

/**
 * @desc 撤销重做
 * @param window.minder 思维导图实例
 *
 */
export function applyPatches(diff) {
  window.minder.applyPatches(diff);
}

/**
 * @desc 设置根节点到视野中心
 * @param window.minder 思维导图实例
 *
 */
export function cameraRoot() {
  window.minder.execCommand("camera", window.minder.getRoot(), 600);
}

/**
 * @desc 放大视野到下一个百分比
 * @param window.minder 思维导图实例
 *
 */
export function zoomIn() {
  window.minder.execCommand("ZoomIn");
}

/**
 * @desc 缩小视野到上一个百分比
 * @param window.minder 思维导图实例
 *
 */
export function zoomOut() {
  window.minder.execCommand("ZoomOut");
}

/**
 * @desc 缩放视野到一定比例
 * @param window.minder 思维导图实例
 *
 */
export function zoom(value) {
  window.minder.execCommand("Zoom", value);
}

/**
 * @desc 切换脑图的抓手状态
 * @param window.minder 思维导图实例
 *
 */
export function hand() {
  window.minder.execCommand("Hand");
  if (window.minder._status === "hand") {
    window.minder.selectById(null, true);
  }
}

/**
 * @desc 获取节点超链接
 * @param window.minder 思维导图实例
 *
 */
export function getHyperlink() {
  const hyperLink = window.minder.queryCommandValue("HyperLink");
  if (isUndefined(hyperLink.url) || isNull(hyperLink.url)) {
    return {};
  }
  return hyperLink;
}

/**
 * @desc 设置节点超链接
 * @param window.minder 思维导图实例
 *
 */
export function handleHyperlink(params) {
  window.minder.execCommand("HyperLink", params.url, params.title);
}

/**
 * 设置节点的主题链接
 * @param {*} value
 */
export function handleNodeLink(value) {
  window.minder.execCommand("nodeLink", value);
}

/**
 * @desc 获取节点图片
 * @param window.minder 思维导图实例
 *
 */
export function getImage() {
  const image = window.minder.queryCommandValue("Image");
  if (isUndefined(image.url) || isNull(image.url)) {
    return {};
  }
  return image;
}

/**
 * @desc 设置节点图片
 * @param window.minder 思维导图实例
 *
 */
export function handleImage(params) {
  window.minder.execCommand("Image", params.url, params.title);
}

/**
 * @desc 展开节点
 * @param window.minder 思维导图实例
 *
 */
export function handleExpand(level) {
  window.minder.execCommand("ExpandToLevel", level);
}

/**
 * @desc 切换脑图模版
 * @param window.minder 思维导图实例
 *
 */
export function handleTemplate(name) {
  window.minder.execCommand("Template", name);
}

/**
 * @desc 获取当前脑图模版主题
 * @param window.minder 思维导图实例
 *
 */
export function getTemplate() {
  return window.minder.queryCommandValue("Template");
}

/**
 * @desc 切换脑图主题
 * @param window.minder 思维导图实例
 *
 */
export function handleTheme(name) {
  window.minder.execCommand("Theme", name);
}

/**
 * @desc 获取当前脑图主题
 * @param window.minder 思维导图实例
 *
 */
export function getTheme() {
  return window.minder.queryCommandValue("Theme");
}

/**
 * @desc 获取脑图当前图片预览状态
 * @param window.minder 思维导图实例
 *
 */
export function getImageViewActive() {
  return window.minder.viewer.actived;
}

/**
 * @desc 重设整个脑图布局
 * @param window.minder 思维导图实例
 *
 */
export function resetLayout() {
  const currentNode = window.minder.getSelectedNode();
  window.minder.selectById(window.minder.getRoot(), true);
  window.minder.execCommand("ResetLayout");
  window.minder.selectById(
    isNull(currentNode) ? null : currentNode.getData("id"),
    true
  );
}

/**
 * @desc 节点上移
 * @param window.minder 思维导图实例
 *
 */
export function handleUp() {
  window.minder.execCommand("ArrangeUp");
}

/**
 * @desc 节点下移
 * @param window.minder 思维导图实例
 *
 */
export function handleDown() {
  window.minder.execCommand("ArrangeDown");
}

/**
 * @desc 复制
 * @param window.minder 思维导图实例
 *
 */
export function handleCopy() {
  window.minder.execCommand("Copy");
}

/**
 * @desc 粘贴
 * @param window.minder 思维导图实例
 *
 */
export function handlePaste() {
  window.minder.execCommand("Paste");
}

/**
 * @desc 设置节点的字体颜色
 * @param window.minder 思维导图实例
 *
 */
export function handleForeColor(color) {
  window.minder.execCommand("ForeColor", color);
}

/**
 * @desc 设置节点的背景颜色
 * @param window.minder 思维导图实例
 *
 */
export function handleBgColor(color) {
  window.minder.execCommand("Background", color);
}

/**
 * @desc 清除节点样式
 * @param window.minder 思维导图实例
 *
 */
export function handleClear() {
  window.minder.execCommand("ClearStyle");
}

/**
 * @desc 通过nodeId定位节点
 * @param window.minder 思维导图实例
 *
 */
export function focusNodeById(nodeId) {
  window.minder.selectById(nodeId, true);
  const nodes = window.minder.getNodesById(nodeId);
  if (!isEmpty(nodes)) {
    window.minder.execCommand("Camera", nodes[0], 0);
    if (!nodes[0].isExpanded()) window.minder.execCommand("Expand", true);
  }
  // window.editor.hotbox.setInterface(true);
}

/**
 * 选中节点
 * @param {*} nodId
 */
export function selectNode(nodeId) {
  window.minder.selectById(nodeId, true);
}

/**
 * @desc 设置节点的sourceId
 * @param window.minder 思维导图实例
 *
 */
export function setSourceId(sourceId) {
  window.minder.getSelectedNode().setData("sourceId", sourceId).render();
}

/**
 * 剪切节点
 */
export function cutNodes() {
  window.minder.execCommand("cut");
}

/**
 * 使脑图不可用
 */
export function disableMinder() {
  window.minder.disable();
}

/**
 * 脑图可用
 */
export function enableMinder() {
  window.minder.enable();
}
