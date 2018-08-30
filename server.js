const express = require('express');
const request = require ('request-promise-native');

const API_KEY = '23e759e53bfc406af5d083810918e144';

const app = express();
app.set('view engine', 'ejs');

app.get('/weather/:city', async(req, res) => {
  try {
    let data = formatData(await getWeatherForCityFromAPI(req.params.city));
    res.render('weather', {
      data
    });
  }catch(err) {
    res.status(500).send(err.error.message + ', or not supported by weather API.');
  }
});

async function getWeatherForCityFromAPI(city) {
  return await request({
    uri: `http://api.openweathermap.org/data/2.5/weather?q=${city},US&appid=${API_KEY}`,
    method: 'GET',
    json:true,
  });
}

const formatData = ({name, weather: [{main}], main: {temp}}) => {
  return {
    name,
    main,
    temp: (9/5 * (temp - 273) + 32).toFixed(0) + ' F'
  }
}

app.listen(3000);
