export const useClosePort = (port: any, callback: Function) => {
  port
    .close()
    .then(() => {
      callback();
    })
    .catch((err: Error) => {
      console.log('🚀 ~ useClosePort ~ err:', err);
    });
};
