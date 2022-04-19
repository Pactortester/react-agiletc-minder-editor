# react-agiletc-minder-editor

基于 react 的 脑图编辑器

# 开发和运行

UI 框架使用 [Ant Design](https://github.com/ant-design/ant-design)

将项目克隆到本地在根目录下执行

```
  npm install
  npm run dev
```

即可运行项目

请配置 `example/app.js` 下的 wsUrl 地址.


# API

| 属性          | 说明                                                                                         | 类型             | 默认值                         |
| ------------- | -------------------------------------------------------------------------------------------- | ---------------- | ------------------------------ |
| readOnly      | 脑图是否可编辑                                                                               | boolean          | false                          |
| editorStyle   | 编辑器样式(高度等)                                                                           | object           |                                |
| baseUrl       | 图片上传请求域名                                                                             | string           |                                |
| uploadUrl     | 图片上传请求接口                                                                             | string           |                                |
| wsUrl         | websocket 请求地址                                                                           | string           |                                |
| onSave        | 保存快捷键方法回调,回传脑图全部数据                                                          | Function(object) |                                |
| type          | 是否为只查看 xmind 数据,type 为 compare 时只读                                               | string           |                                |
| onResultChange | 用例执行的结果状态有变更时会回调，用于实时更新顶部的执行结果占比的进度条                                              | Function(object)           |                                |
