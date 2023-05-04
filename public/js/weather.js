const inputlocation = document.querySelector('.location');
async function weather() {
  const divTempC = document.querySelector('.temp_c');
  try {
    const place = inputlocation.value ? inputlocation.value : 'Cracow';
    const url = `https://api.weatherapi.com/v1/current.json?key=773040ef070e445e97a120508232601&q=${place} &aqi=no`;
    const data = await (await fetch(url)).json();
    document.querySelector('header img').src = data.current.condition.icon;
    inputlocation.value = data.location.name;
    divTempC.textContent = `${data.current.temp_c}`;
  } catch (e) {
    inputlocation.value = 'No such place exist';
    divTempC.textContent = '';
  }
}

inputlocation.addEventListener('blur', weather);
inputlocation.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    weather(inputlocation.value);
  }
});

weather();
