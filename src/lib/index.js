const getHourAndMinute = minute => {
  const hour = Math.floor(minute / 60);
  const min = minute % 60;
  return {hour, min};
};

const toHour = minute => {
  const {hour, min} = getHourAndMinute(minute);
  const doubleDigitsHour = ('0' + hour).slice(-2);
  const doubleDigitsMinute = ('0' + min).slice(-2);
  return `${doubleDigitsHour}h${doubleDigitsMinute}`;
};

export const getUpdatedProject = (diff, current) => {
  const signedDiff = parseInt(diff);
  const currentWorkMinute = current.workMinute;
  const workMinute = signedDiff + currentWorkMinute;
  const workHour = toHour(workMinute);
  const lastUpdate = getLastUpdate();

  return {
    ...current,
    workMinute,
    workHour,
    lastUpdate,
  };
};

export const getLastUpdate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const doubleDigitsMonth = ('0' + (date.getMonth() + 1)).slice(-2);
  const doubleDigitsDate = ('0' + date.getDate()).slice(-2);
  const hour = ('0' + date.getHours()).slice(-2);
  const minute = ('0' + date.getMinutes()).slice(-2);
  return `${year}-${doubleDigitsMonth}-${doubleDigitsDate} ${hour}:${minute}`;
};
