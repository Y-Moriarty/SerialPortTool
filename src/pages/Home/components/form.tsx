import { Button, Form, Input, InputNumber, Select, Switch, message } from 'antd';
import dateForForm from '../Hooks/formOptions.json';
import usePorts from '../Hooks/usePorts';

const MyForm = ({ setDatas, setMsgData, clearMsg, saveContent }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const { sendMessage, getPort, ports, cancelReader, closePort, clearContent, handlePortChange, handleSwitchChange, onFinish, readStream } =
    usePorts(messageApi, setDatas, setMsgData);

  const [form] = Form.useForm();

  const formInitialValue = {
    parity: 'none',
    dataBits: 8,
    stopBits: 1,
    baudRate: 115200,
    isHex: false,
    message: ''
  };

  const sendMsg = () => {
    const msg = form.getFieldValue('message')
    sendMessage(msg)
  }

  return (
    <>
      {/* antd message 使用 useMessage Hooks 方式 需要以此来消费上下文 */}
      {contextHolder}
      <Form form={form} name="control-hooks" onFinish={onFinish} initialValues={formInitialValue}>
        <Form.Item name="port" label="Port" rules={[{ required: true }]}>
          <Select style={{ width: 100 }} onChange={handlePortChange} options={ports} />
        </Form.Item>
        <Form.Item name="parity" label="Parity" rules={[{ required: true }]}>
          <Select style={{ width: 100 }} options={dateForForm.parity} />
        </Form.Item>
        <Form.Item name="dataBits" label="Stop bits" rules={[{ required: true }]}>
          <Select style={{ width: 100 }} options={dateForForm.dataBits} />
        </Form.Item>
        <Form.Item name="stopBits" label="Data bits" rules={[{ required: true }]}>
          <Select style={{ width: 100 }} options={dateForForm.stopBits} />
        </Form.Item>
        <Form.Item name="isHex" label="Hex">
          <Switch onChange={handleSwitchChange} />
        </Form.Item>
        <Form.Item name="baudRate" label="BaudRate" rules={[{ required: true }]}>
          <Select style={{ width: 100 }} options={dateForForm.baudRates} />
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.baudRate !== currentValues.baudRate}>
          {({ getFieldValue }) =>
            getFieldValue('baudRate') === 'custom' ? (
              <Form.Item name="custombaudRate" label="CuzbaudRate" rules={[{ required: true }]}>
                <InputNumber />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item className='btns'>
          <Button className="btn" type="primary" onClick={getPort}>
            getPort
          </Button>
          <Button className="btn" type="primary" htmlType="submit">
            connectToPort
          </Button>
          <Button className="btn" type="primary" onClick={() => readStream()}>
            startReader
          </Button>
          <Button className="btn" type="primary" danger onClick={() => cancelReader()}>
            cancelReader
          </Button>
          <Button className="btn" type="primary" danger onClick={() => closePort()}>
            closePort
          </Button>
          <Button className="btn" type="primary" onClick={() => saveContent()}>
            saveContent
          </Button>
          <Button className="btn" type="primary" danger onClick={() => clearContent()}>
            clearContent
          </Button>
        </Form.Item>
        <Form.Item className='message'>
          <Form.Item name="message" label="Send message">
            <Input />
          </Form.Item>
          <Button type='primary' onClick={() => sendMsg()}>send</Button>
          <Button type='primary' onClick={() => clearMsg()} danger>clearMsg</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default MyForm;
