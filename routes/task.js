const express = require('express');
const { readFile, writeFile } = require('fs').promises;

const taskRouter = express.Router();
const FILE_NAME = 'data/tasks.json';
const ReadData = async () => JSON.parse(await readFile(FILE_NAME, 'utf8'));

taskRouter
  .post('/add', async (req, res) => {
    const data = await ReadData();
    if(req.body.text.length > 0) {
      data.push(req.body);
      await writeFile(FILE_NAME, JSON.stringify(data));
      res.send('OK');
    }else {
      res.status(400).send("Task have to have at least one sign");
    }
  })
  .post('/check', async (req, res) => {
    const data = await ReadData();
    const { nr } = req.body;
    await data.forEach((element, index) => {
      if (element.nr === nr) {
        data[index].checked = !data[index].checked;
      }
    });
    await writeFile(FILE_NAME, JSON.stringify(data));
    res.send('OK');
  })
  .post('/delete', async (req, res) => {
    const data = await ReadData();
    const { nr } = req.body;
    await data.forEach((element, index) => {
      if (element.nr === nr) {
        data.splice(index, 1);
      }
    });
    await writeFile(FILE_NAME, JSON.stringify(data));
    res.send('OK');
  })
  .post('/edit', async (req, res) => {
    const data = await ReadData();
    const { nr, text } = req.body;
    await data.forEach((element, index) => {
      if (element.nr === nr) {
        data[index].text = text;
      }
    });
    await writeFile(FILE_NAME, JSON.stringify(data));
    res.send('OK');
  });

module.exports = {
  taskRouter,
};
