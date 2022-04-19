import * as React from 'react';
import './App.less';
import 'kity';
import './assets/kityminder-core/kityminder.core.js';
import './assets/kityminder-core/kityminder.core.css';
import * as editorCommand from './command/EditorCommand';
import HotBox from './model/HotBox';
import History from './model/History';
import ToolBox from './model/ToolBox';
import Runtime from './model/Runtime';
import Navigator from './model/Navigator';
import NoteRender from './pages/NoteRender';
import SearchRenderV2 from './pages/SearchRenderV2';
import ToolBoxRender from './pages/ToolBox';
import EditUsersRender from './pages/EditUsers';
import NavigatorRender from './pages/NavigatorRender';
import ClipBoard from './model/ClipBoard';
import Mind from './pages/Mind';
import Exterior from './pages/Exterior';
import ShotCutModal from './pages/ShotCut';
import { Input, Tabs, notification, Button, Icon, Spin, Tooltip, Switch, Drawer } from 'antd';
import { isUndefined, isArray, endsWith } from 'lodash';
import Websocket from './websocket/Websocket';




class App extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      url: '',
      editText: "",
      // 使用的资源
      usedResource: [],
      // 节点信息
      nodeInfo: {
        id: '',
        text: '',
        note: '',
        hyperlink: {},
        image: {},
        timeStamp: String(new Date().getTime())
      },
      // 是否选中节点
      isNode: false,
      // 主题
      theme: 'fresh-blue-compat',
      // 模板
      template: '',
      // 是否存在撤销
      hasUndo: false,
      // 是否存在重做
      hasRedo: false,
      // 工具箱的显示状态
      toolbox: false,
      // 工具箱的
      toolboxTab: 'review',

      showTip: false,   //是否显示结果文字
      curIndex: 0,   // 当前处于第一条
      resultNum: 0,  // 搜索结果共几条
      zoom: 100,
      triggerActive: true,
      fullScreen: false,
      tags: ['前置条件', '执行步骤', '预期结果'],
      expand: true,
      websocketStatus: 0,// 0 异常， 1 正常  
      readOnly: props.readOnly || false,
      spinning: true, // 加载中
      caseId: '',
      userName: '',
      recordId: '',
      editUsers: [],
      isScore: '0',
      minderStatus: "normal",
      searchDrawerVisible: false,
    },
      this.baseVersion = 0;
    window.editor = {};
    this.timeoutObj = null;
    this.SPLITOR = '\uFEFF';
    this.userName = '';
    this.isFirst = true;
  }


  componentWillUnmount = () => {
    // 清除掉定时上报心跳的定时任务
    if (this.timeoutObj != null) {
      clearInterval(this.timeoutObj);
      this.timeoutObj = null;
    }
    // 去掉复制粘贴的listener
    window.editor.clipBoard.unMount();
  }


  componentDidMount = () => {

    // 处理caseId 以及userName;
    // ws://xwcase.gz.cvte.cn/api/case/2245/undefined/0/zsx
    // this.initData(this.props.wsUrl);

    let urls = this.props.wsUrl.split("/");
    this.userName = urls[urls.length - 1];
    window.minder.editor = this.userName;
    this.setState({
      caseId: urls[5],
      recordId: urls[6],
      isScore: urls[7],
      userName: this.userName
    })
    // 将实例化对象 传回给父组件
    if (this.props.editorRef) {
      this.props.editorRef(this);
    }

    if (this.props.type === '' && this.props.editor.length !== 0 && this.props.editor.indexOf(this.userName) === -1) {
      this.disableMinder();
    }


    if (!isUndefined(this.props.tags)) {
      this.setState({
        tags: this.props.tags
      })
    }

    // 
    window.editor = {
      runtime: new Runtime(this),
      hotbox: new HotBox(this),
      history: new History(this),
      clipBoard: new ClipBoard(this),
      toolbox: new ToolBox(this),
      navigator: new Navigator(this)
    }
  }


  componentWillReceiveProps = (nextProps) => {
    // 处理当前用户不是编辑人的情况
    if (nextProps.type === '' && JSON.stringify(nextProps.editor) !== JSON.stringify(this.props.editor)) {
      if (nextProps.editor.indexOf(this.userName) === -1) {
        window.minder.disable()
        this.setState({
          minderStatus: 'disabled'
        })
      }

    }
  }


  /**
   * 处理所有state状态
   */
  handleState = (type, value) => {
    if (type === 'nodeInfo') {
      this.setState({
        nodeInfo: value,
        isNode: value.id === '' ? false : true
      })
    } else {
      this.setState({
        [type]: value
      })
    }

  }


  handleChange = (value) => {
    this.setState({
      editText: value
    })
  }


  getEditText = () => {
    return this.state.editText;
  }


  /**
   * 返回所有的数据
   */
  getAllData = () => {
    let root = editorCommand.exportJson();
    root.base = this.baseVersion;
    return root;
  }



  /**
   * 设置编辑器的数据
   * @param {*} value 
   */
  setEditerData = (value) => {
    editorCommand.importJson(value)
  }


  start = () => {
    this.timeoutObj = setInterval(() => {
      this.sendMessage('0ping ping ping')
    }, 10000)
  }


  handleWsOpen = () => {
    if (this.timeoutObj != null) {
      clearInterval(this.timeoutObj);
    }


    this.setState({
      websocketStatus: 1,
    })
    this.start();

  }



  sendMessage = (message) => {
    if (!isUndefined(this.refWebSocket) && this.refWebSocket !== null) {
      this.refWebSocket.sendMessage(message);
    }
  }



  /**
   * 处理服务端的ws的数据
   * @param {} message 
   * @returns 
   */
  handleWsData = (message) => {
    // 收到当前用户的数据
    if (message.substring(0, 4) === '当前用户') {
      notification.warn({
        message,
      })
    } else if (message.substring(0, 1) === '2') {
      // 消息回复的信息处理

    } else {
      if (message === 'ping ping ping') {
        this.sendMessage('0pong pong pong')
        return;
      }
      try {
        let minderData = JSON.parse(message);
        // 区别是更新 还是加载一个新的文件
        if (isArray(minderData)) {
          if (isArray(minderData[0])) {
            if (minderData[0][0].value > parseInt(this.baseVersion)) {
              this.baseVersion = minderData[0][0].value
            }


          } else {
            let temp = minderData.filter(item => item.path === '/base')
            if (temp[0].value !== (parseInt(this.baseVersion) + 1)) {
              alert("版本信息不正确, 请刷新页面同步数据！！！， 否则会导致数据丢失");
            } else {
              this.baseVersion = temp[0].value
              window.editor.history.isSync = true;
              editorCommand.applyPatches(minderData);
              // 这里如果是任务执行的情况下 还需要同步任务结果数据
              if (this.props.type === 'record') {
                // 如果是任务执行，需要去回调这个结果
                this.onResultChange();

              }
            }
          }

        } else {
          if (minderData.type === 'all_users') {
            // 这里处理用户信息的地方
            this.setState({
              editUsers: minderData.data
            })
          } else {
            // websocket 链接后的第一次数据传输
            this.baseVersion = minderData.base
            editorCommand.importJson(minderData, this.isFirst);
            this.isFirst = false;
          }



        }

      } catch (e) {
        // 这里需要处理异常
      }
    }
  }


  /**
   * 发送补丁数据
   */
  sendPatch = (diff) => {
    if (this.state.editUsers.length > 1) {
      // 如果说编辑的人超过了1人的话 部分的样式修改 ，需要把它过滤掉
      diff = diff.filter(item => {
        return !endsWith(item.path, "layout") &&
          !endsWith(item.path, "layout_right_offset") &&
          !endsWith(item.path, "expandState") &&
          !endsWith(item.path, "layout_right_offset/y") &&
          !endsWith(item.path, "layout_right_offset/x")
      })
    }

    this.sendMessage("1" + JSON.stringify({ case: this.getAllData(), patch: [diff], }))
  }


  /**
   * 使脑图不可用
   */
  disableMinder = () => {
    editorCommand.disableMinder();
    this.setState({
      minderStatus: 'disabled'
    })
  }


  /**
   * 脑图可用
   */
  enableMinder = () => {
    editorCommand.enableMinder();
    this.setState({
      minderStatus: 'normal'
    })
  }



  /**
   * ws 连接断开时
   * @param {*} e 
   */
  handleWsClose = () => {
    this.setState({
      websocketStatus: 0,
    })
    this.refWebSocket = null;
    // this.disableMinder()
  }


  handleEditPaste = (e) => {
    var clipBoardEvent = e;
    try {
      // 提取出里面的文本内容
      let pasteText = "";
      var textData = clipBoardEvent.clipboardData.getData('text/plain');
      if (textData.indexOf(this.SPLITOR) !== -1) {
        const data = textData.split(this.SPLITOR);
        let nodes = JSON.parse(data[1]);

        for (const item of nodes) {
          if (pasteText !== '') {
            pasteText += "\n";
          }
          pasteText += item.data.text
        }
        this.setState({
          editText: this.state.editText === '' ? pasteText : (this.state.editText + "\n" + pasteText)
        })
        e.preventDefault();
      }
    } catch (e) {
      console.log(e);
    }


  }


  onMindRef = (ref) => {
    this.mindRef = ref;
  }

  /**
   * 设置mind的超链接弹出框可见
   */
  setMindHyperLinkVisible = () => {
    this.mindRef.setHyperlink(true);
  }

  /**
   * 获取到record搜索数据的上下文
   */
  onRecordSearchRef = (ref) => {
    this.recordStatusSearchRef = ref;
  }


  /**
   * 执行结果数据发生改变时
   */
  onResultChange = () => {
    if (this.props.onResultChange) {
      this.props.onResultChange();
    }

    if (this.state.searchDrawerVisible && this.props.type === 'record'
      && this.recordStatusSearchRef.state.recordStatus !== ''
    ) {
      this.recordStatusSearchRef.handleChange(this.recordStatusSearchRef.state.recordStatus);
    }
  }

  render() {
    const operations =
      <React.Fragment>
        <ShotCutModal>
          <Tooltip placement="top" title={'快捷键'}>
            <Icon type="question-circle" />
          </Tooltip>
        </ShotCutModal>

        {
          this.props.readOnly ? null :
            <Tooltip title={this.state.websocketStatus === 0 ? '当前websocket链接已断开' : (this.props.editor && this.props.editor.indexOf(this.userName) === -1) ? "你没有当前用例的编辑权限" : null}>
              <Switch
                onClick={
                  (checked) => {
                    if (checked) {
                      this.disableMinder()
                    } else {
                      this.enableMinder();
                    }
                  }}
                disabled={this.state.websocketStatus === 0 || (this.props.editor && this.props.editor.indexOf(this.userName) === -1)}
                checkedChildren="只读"
                unCheckedChildren="编辑"
                checked={this.state.minderStatus !== 'normal'}
              />

            </Tooltip>

        }

        <span style={{ color: this.state.websocketStatus === 0 ? 'red' : '' }}>{this.state.websocketStatus === 0 && this.props.type !== 'compare' && this.props.type !== 'backup' ? '连接房间异常,请保存数据' : ''}</span>
        <Button type='link' onClick={() => {
          // 回调回去父组件的方法
          if (this.props.onExpandChange) {
            this.props.onExpandChange(!this.state.expand);
          }
          this.setState({ expand: !this.state.expand })
        }}>
          <Icon type="double-left" style={{ transform: this.state.expand ? "rotate(90deg)" : "rotate(-90deg)" }} />
          {this.state.expand ? '收起' : '展开'}
        </Button>
      </React.Fragment>
      ;

    return (
      <div id='kityminder-editor' style={this.props.editorStyle} className="kityminder-editor-container kityminder-editor">
        {
          this.props.type !== 'compare' && this.props.type !== 'backup' &&
          <Websocket
            debug={true}
            url={this.props.wsUrl}
            onOpen={this.handleWsOpen}
            onClose={this.handleWsClose}
            onMessage={this.handleWsData}
            onError={(e) => {
              notification.warn({
                message: "websocket连接错误"
              })
            }}
            ref={Websocket => {
              this.refWebSocket = Websocket;
              window.websocket = Websocket;
            }}
          />
        }
        <NoteRender />

        {
          this.state.searchDrawerVisible && <SearchRenderV2
            onRecordSearchRef={this.onRecordSearchRef}
            visible={this.state.searchDrawerVisible}
            handleState={this.handleState}
            recordId={this.state.recordId}
            type={this.props.type}
            expand={this.state.expand}
          >
          </SearchRenderV2>
        }



        {
          // 在线用户的逻辑不一样，暂时先隐藏起来
          // <EditUsersRender
          //   userName={this.state.userName}
          //   editUsers={this.state.editUsers}
          // />
        }


        {
          this.props.readOnly ? null : <ToolBoxRender
            type={this.props.type}
            nodeInfo={this.state.nodeInfo}
            handleState={this.handleState}
            toolbox={this.state.toolbox}
            toolboxTab={this.state.toolboxTab}
            caseId={this.state.caseId}
            userName={this.state.userName}
            caseCreator={this.props.caseCreator}
            readOnly={this.props.readOnly}
          />
        }


        <NavigatorRender
          zoom={this.state.zoom}
          triggerActive={this.state.triggerActive}
          fullScreen={this.state.fullScreen}
        />
        {

          <Tabs defaultActiveKey={this.props.type === 'compare' ? 'exterior' : 'mind'} size='small' className='editor-tabs' tabBarExtraContent={operations}>
            {
              this.props.type === 'compare' ? null :
                <Tabs.TabPane tab='思路' key='mind' >
                  <Mind
                    {...this}
                    onRef={this.onMindRef}
                    userName={this.state.userName}
                    usedResource={this.state.usedResource}
                    isNode={this.state.isNode}
                    nodeInfo={this.state.nodeInfo}
                    history={window.editor.history}
                    editable={true}
                    hasUndo={this.state.hasUndo}
                    hasRedo={this.state.hasRedo}
                    tags={this.state.tags}
                    expand={this.state.expand}
                    uploadUrl={this.props.uploadUrl}
                    readOnly={this.state.readOnly}
                    handleState={this.handleState}
                    onResultChange={this.onResultChange}
                  />
                </Tabs.TabPane>
            }

            <Tabs.TabPane tab='外观' key='exterior'>
              <Exterior
                handleState={this.handleState}
                theme={this.state.theme}
                template={this.state.template}
                expand={this.state.expand}
                type={this.props.type}
                minderStatus={this.state.minderStatus}
              />
            </Tabs.TabPane>
          </Tabs>
        }




        <div id='kityminder-core' tabIndex={-1} className='kityminder-core-container focus'
          ref={(input) => {
            if (!this.minder) {
              this.minder = new window.kityminder.Minder({
                renderTo: input,
                enableAnimation: false,
                defaultTheme: 'fresh-blue-compat'
              });
              window.minder = this.minder;
              window.minder.editor = this.userName;
              window.minder.type = (this.props.type === 'compare' || this.props.type === 'record' || this.props.type === 'backup') ? 'disable' : '';
            }
          }}>

          <Spin spinning={this.state.spinning} style={{ position: 'absolute', width: '100%', marginTop: 300, zIndex: 10002 }} />

          <div
            id='node-input-container'
            style={{ display: 'none', maxWidth: '300px', }}
            className='m-input'>
            <Input.TextArea
              id='core-node-input-disableKeydown'
              value={this.state.editText}
              onChange={
                e => this.handleChange(e.target.value)
              }
              onPaste={
                e => this.handleEditPaste(e)
              }
              autoSize={{ minRows: 1, maxRows: 10 }}
            />
          </div>
        </div>

      </div>
    )
  }

}


export default App
