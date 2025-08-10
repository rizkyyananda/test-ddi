function successResponse<T>(data: T, message = 'Success') {
  return {
    status: 'success',
    message,
    data,
  };
}
export { successResponse };