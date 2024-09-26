export const useFormatData = (data: Uint8Array) => {
  let arr = new Uint8Array(data);
  let hexstr = '';
  let formatData = '';

  hexstr += `${data.toString()}    `;
  for (const v of arr) {
    formatData += (Array(2).join('0') + v.toString(16).toUpperCase()).slice(2);
  }
  formatData = `${formatData}    `;
  // console.log('🚀 ~ formatValue ~ hexstr & formatData:', hexstr, formatData);
  return { formatData, hexstr };
};
