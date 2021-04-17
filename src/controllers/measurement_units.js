const express = require('express');
const db = require('../models');

const router = express.Router();
async function read(req, res, next) {
  try {
    const data = await db.Measurement_units.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
}

module.exports = router;
