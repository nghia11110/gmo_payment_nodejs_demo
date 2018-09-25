/*
type Error = {
  status: ?number,
  message: string,
}
*/
const error = (status, message, option) => ({
  status,
  message,
  option,
  type: 'application',
});

export default error;
