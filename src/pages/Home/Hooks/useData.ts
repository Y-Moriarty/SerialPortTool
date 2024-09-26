import { useState } from 'react';

const useData = () => {
  const [data, setData] = useState('');

  const getData = () => {
    return data;
  };

  const setDatas = (val) => {
    setData(val);
  };

  // const clearDatas = () => {
  //   setData('');
  // };

  return { getData, setDatas };
};

export default useData;
