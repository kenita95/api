const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await db.User.create({
      role: 'admin',
      title: true,
      first_name: 'System',
      last_name: 'Admin',
      email: 'admin@system.com',
      // employee_number: 10001,
      password: '123456',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
