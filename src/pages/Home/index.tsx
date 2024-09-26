import useData from "./Hooks/useData";
import './index.scss';

import { useState } from "react";
import MyForm from "./components/form";

const Home = () => {
  const { getData, setDatas } = useData();
  const [msgs, setMsgs] = useState('');

  const setMsgData = (msg: string) => {
    setMsgs(msgs => msgs += `${msg}\n`)
  }

  const clearMsg = () => {
    setMsgs('')
  }

  /**
   * save hexData / formatedData to content.txt
   * @returns {void}
   */
  const saveContent = () => {
    const a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(getData());
    a.download = "content.txt";
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
  }

  return (
    <div className="home">
      {/* 配置以及控制区域 */}
      <div className="settings">
        <MyForm setDatas={setDatas} setMsgData={setMsgData} clearMsg={clearMsg} saveContent={saveContent} />
      </div>
      {/* 数据接收与展示区域 */}
      <div className="data">
        <div className="data-send">
          Sended：<br />
          {msgs}
        </div>
        <div className="data-result">
          Received：<br />
          {/* {data} */}
          {getData()}
        </div>
      </div>
    </div>
  )
}

export default Home