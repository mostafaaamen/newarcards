export const ConnectPrice = (connectOne, connectTwo) => {
  const combinedKeys = [
    ...new Set([...Object.keys(connectOne), ...Object.keys(connectTwo)]),
  ];
  const sumByKey = combinedKeys.reduce((result, key) => {
    if (connectOne.hasOwnProperty(key) && connectTwo.hasOwnProperty(key)) {
      result[`${key}`] = connectOne[key] + connectTwo[key];
    } else if (connectOne.hasOwnProperty(key)) {
      result[`${key}`] = connectOne[key];
    } else if (connectTwo.hasOwnProperty(key)) {
      result[`${key}`] = connectTwo[key];
    }
    return result;
  }, {});
  return sumByKey;
};
