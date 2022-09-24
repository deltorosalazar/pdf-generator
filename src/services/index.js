const computeResults = require('./computeResults');
const { readSheets, readFullSheet } = require('./readSheets');
const { readSheetsFromFirestore } = require('./readSheetsFromFirestore');
const generateChart = require('./generateChart');

module.exports = {
  computeResults,
  generateChart,
  readSheets,
  readSheetsFromFirestore,
  readFullSheet
};
