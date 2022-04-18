import React from 'react'
import { render } from 'react-dom'
import ReactDemo from '../src/App' // 引入组件

const App = () => <ReactDemo
    //ws://127.0.0.1:8094/api/case/4/undefined/0/zsx1
    //
    // editor = {["zhengshengxiong"]}
    // caseCreator = {"zsx"}
    uploadUrl="/api/file/uploadAttachment"
    wsUrl={`ws://xwcase.gz.cvte.cn/api/case/2244/undefined/0/zsx`}
    onResultChange = {() => {
        console.log("o1nResultChange callback")
    }}
    editorStyle={{ height: 'calc(100vh - 100px)' }}
    readOnly={false}
    editorRef={editorNode => {console.log(editorNode)}}
    onSave={
        () => {
            console.log("sss");
        }
    }
    type = "record"
    // reviewId = ""
/>
render(<App />, document.getElementById('root'))