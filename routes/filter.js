const express = require('express');
const { readFile, writeFile } = require('fs').promises;

const filterRouter = express.Router();

const FILE_NAME = 'data/tasks.json';
const ReadData = async () => JSON.parse(await readFile(FILE_NAME, 'utf8'));

filterRouter
  .get('/all', async (req, res) => {
    res.json(JSON.parse(await readFile('data/tasks.json', 'utf8')));
  })
  .get('/active', async (req, res) => {
    const data = await ReadData();
    const sortedData = data.filter((d) => d.checked === false);
    res.json(sortedData);
  })
  .get('/completed', async (req, res) => {
    const data = await ReadData();
    const sortedData = data.filter((d) => d.checked === true);
    res.json(sortedData);
  })
  .post('/clear-completed', async (req, res) => {
    const data = await ReadData();
    const newData = data.filter((d) => d.checked === false);
    await writeFile('data/tasks.json', JSON.stringify(newData));
    res.send('OK');
  });

module.exports = {
  filterRouter,
};
