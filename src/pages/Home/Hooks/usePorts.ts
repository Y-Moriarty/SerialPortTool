import { useFormatData } from '@/utils/useFormatDate';
import { MessageInstance } from 'antd/es/message/interface';
import { useEffect, useRef, useState } from 'react';

const usePorts = (messageApi: MessageInstance, setDatas: (arg0: string) => void, setMsgData: (msgs: string) => void) => {
  const [ports, setPorts] = useState<{ label: string; value: string; port: {} }[]>([]);
  const [curPort, setCurPort] = useState({});

  const hexData = useRef('');
  const formatedData = useRef('');

  const isReading = useRef(false);
  const isOpen = useRef(false);
  const reader = useRef(null);
  const isHex = useRef(false);

  useEffect(() => {
    const getPorts = async () => {
      return await navigator.serial.getPorts();
    };

    getPorts().then((ports) => {
      console.log(ports);
      const p = ports.map((item: {}, index: number) => {
        return { label: `port${index}`, value: `port${index}`, port: item };
      });
      setPorts(p);
    });
  }, []);

  const getPort = () => {
    if (isOpen.current) {
      messageApi.open({
        type: 'warning',
        content: 'Port is not close!'
      });
      return;
    }

    navigator.serial
      .requestPort({})
      .then((port: {}) => {
        console.log('🚀 ~ navigator.serial.requestPort ~ port:', port);
        let idx = -1;
        const flag = ports.every((item, index) => {
          idx = index;
          return item.port !== port;
        });
        if (flag) {
          const newPort = { port, label: `port${ports.length}`, value: `port${ports.length}` };
          setPorts((ports) => [...ports, newPort]);
        } else {
          form.setFieldValue('port', ports[idx].value);
        }
        setCurPort(port);
      })
      .catch((err: any) => {
        console.log('🚀 ~ navigator.serial.requestPort ~ err:', err);
      });
  };

  /**
   * Read data from serial port
   * @returns {Promise<void>}
   * @throws Will throw if port is not open or if port is on reading
   */
  const readStream = async () => {
    if (!isOpen.current) {
      messageApi.open({
        type: 'warning',
        content: 'Port is not open!'
      });
      return;
    }

    if (isReading.current) {
      messageApi.open({
        type: 'warning',
        content: 'Port is on reading!'
      });
      return;
    }
    isReading.current = true;

    while (curPort.readable && isReading.current) {
      reader.current = curPort.readable.getReader();
      try {
        while (true) {
          const { value, done } = await reader.current?.read();
          console.log('🚀 ~ readStream ~ value:', value);
          if (done) {
            // |reader| has been canceled.
            break;
          }
          // Do something with |value|…
          const { hexstr, formatData } = useFormatData(value);
          hexData.current += hexstr;
          formatedData.current += formatData;
          setDatas(isHex.current ? hexData.current : formatedData.current);
        }
      } catch (error) {
        console.log('🚀 ~ readStream ~ error:', error);
      } finally {
        reader.current?.releaseLock();
      }
    }
  };

  /**
   * Handle form submit & open serial port & start readStream
   * @param {Object} values - form values
   * @returns {Promise<void>}
   * @throws Will throw if port is not open or if port is on reading
   */
  const onFinish = async (values: any) => {
    console.log('🚀 ~ onFinish ~ values:', values);
    if (isOpen.current) {
      messageApi.open({
        type: 'warning',
        content: 'Port is open!'
      });
      return;
    }
    const { parity, dataBits, stopBits, baudRate, custombaudRate } = values;
    // const bdr = baudRate === 'custom' ? + custombaudRate : baudRate
    await curPort.open({ parity, dataBits, stopBits, baudRate: custombaudRate ? +custombaudRate : baudRate }).then(() => {
      isOpen.current = true;
      clearData();
      setDatas('');
      console.log('🚀 ~ awaitcurPort.open ~');
      readStream();
    });
  };

  /**
   * Cancel the current port reading
   * @returns {void}
   * @throws Will throw if port is not open or if port is not on reading
   */
  const cancelReader = () => {
    if (!isOpen.current) {
      messageApi.open({
        type: 'warning',
        content: 'Port is not open!'
      });
      return;
    }
    if (!isReading.current) {
      messageApi.open({
        type: 'warning',
        content: 'Port is not on reading!'
      });
      return;
    }
    isReading.current = false;
    reader.current?.cancel().catch((err: Error) => {
      console.log('🚀 ~ cancelReader ~ err:', err);
    });
  };

  const clearData = () => {
    hexData.current = '';
    formatedData.current = '';
  };

  /**
   * Close the current port
   * @returns {Promise<void>} When the port is closed, the promise is resolved
   * @throws Will throw if port is not open or if port is not on reading
   */
  const closePort = () => {
    if (!isOpen.current) {
      messageApi.open({
        type: 'warning',
        content: 'Port is not open!'
      });
      return;
    }

    if (!reader.current) {
      messageApi.open({
        type: 'warning',
        content: 'Port is not getReader!'
      });
      return;
    }

    const callback = async () => {
      await curPort
        .close()
        .then(() => {
          isOpen.current = false;
          clearData();
          messageApi.open({
            type: 'success',
            content: 'Port close success!'
          });
        })
        .catch((err: Error) => {
          console.log('🚀 ~ callback ~ err:', err);
        });
    };

    if (isReading.current) {
      isReading.current = false;
      reader.current
        ?.cancel()
        .then(() => {
          callback();
        })
        .catch((err: Error) => {
          console.log('🚀 ~ callback ~ err:', err);
        });
    } else {
      callback();
    }
  };

  const clearContent = () => {
    clearData();
    setDatas('');
  };

  const handlePortChange = (val: any, option: any) => {
    console.log('🚀 ~ handlePortChange ~ val:', val);
    setCurPort(option.port);
  };

  const handleSwitchChange = (checked: boolean) => {
    isHex.current = checked;
  };

  /**
   * Send a message to the serial port
   * @param {string} msg - message to send
   * @returns {void}
   * @throws Will throw if port is not open or if port has not writableStream
   * @throws Will throw if the message is empty
   */
  const sendMessage = (msg: string) => {
    console.log('🚀 ~ sendMessage ~ msg:', msg);
    if (msg) {
      if (isOpen.current && curPort.writable) {
        const writer = curPort.writable.getWriter();
        const encoder = new TextEncoder();

        writer
          .write(encoder.encode(msg))
          .then(() => {
            messageApi.success(`Message has been sended: '${msg}'`);
            setMsgData(msg);
          })
          .catch((err: Error) => {
            console.log('🚀 ~ writer.write ~ err:', err);
          })
          .finally(() => {
            writer.releaseLock();
          });
      } else {
        messageApi.warning('Port is not open or port has not writableStream');
      }
    } else {
      messageApi.warning('The message is empty');
    }
  };

  return {
    cancelReader,
    clearContent,
    closePort,
    isOpen,
    isReading,
    isHex,
    reader,
    handlePortChange,
    handleSwitchChange,
    onFinish,
    readStream,
    setCurPort,
    getPort,
    ports,
    sendMessage
  };
};

export default usePorts;
