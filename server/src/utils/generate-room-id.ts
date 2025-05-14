export const generateRoomID = () => {
  const number = Math.floor(Math.random() * 1000000);
  let code = number.toString();
  while (code.length < 6) {
    code = "0" + code;
  }
  return code;
};
