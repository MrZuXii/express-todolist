const clock = () => {
  const data = new Date();
  let hour = data.getHours();
  let minutes = data.getMinutes();
  let seconds = data.getSeconds();
  if (hour < 10) hour = `0${hour}`;
  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;
  document.querySelector('.clock').textContent = `${hour}:${minutes}:${seconds}`;
};
const todayData = () => {
  const data = new Date();
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = data.getFullYear();
  const day = data.getDate();
  const month = shortMonths[data.getMonth()];
  document.querySelector('.today-data').textContent = `${month} ${day}, ${year}`;
};

todayData();
clock();
setInterval(clock, 1000);
