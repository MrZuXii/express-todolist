const express = require('express');
const { readFile } = require('fs').promises;
const { filterRouter } = require('./routes/filter');
const { taskRouter } = require('./routes/task');

const port = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/filter', filterRouter);
app.use('/task', taskRouter);

app.get('/render', async (req, res) => {
  const data = JSON.parse(await readFile('data/tasks.json', 'utf8'));
  res.json(data);
});

app.listen(port);
