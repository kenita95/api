const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models');

const { Op } = db.Sequelize;

const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    // CHECK EMAIL EXISTS
    const isEmailExists = await db.User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (isEmailExists) {
      return res.sendStatus(422);
    }

    // CREATE USER
    const data = await db.User.create(req.body, { transaction });

    // ADD AUDIT
    await db.Audit.create({
      action: 'Create',
      area: 'user',
      description: `Created user ${data.dataValues.id}`,
      userId: req.user.userId,
      reference: data.dataValues.id,
    }, { transaction });

    await transaction.commit();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error)
    await transaction.rollback();
    return res.sendStatus(500);
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await db.User.findAll({
      attributes: ['id', 'title', 'first_name', 'last_name', 'role', 'email', 'status', 'fullName'],
      where: {
        email: {
          [
          Op.ne
          ]: 'admin@system.com',
        },
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/readById/:id', async (req, res) => {
  try {
    const data = await db.User.findOne({

      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // CHECK USER EXISTS

    const isValidUser = await db.User.findOne({
      raw: true,
      where: {
        email,
        status: 1,
      },
    });

    if (!isValidUser) {
      return res.sendStatus(401);
    }

    // CHECK PASSWORD

    const isPasswordMatch = await bcrypt.compare(
      password,
      isValidUser.password,
    );

    if (!isPasswordMatch) {
      return res.sendStatus(401);
    }

    // GENERATE JWT

    const token = await jwt.sign({
      role: isValidUser.role,
      userId: isValidUser.id,
    },
    process.env.JWT_KEY);

    const name = `${isValidUser.title ? 'Mr. ' : 'Ms. '} ${isValidUser.first_name} ${isValidUser.last_name}`;

    return res.status(200).json({
      token,
      role: isValidUser.role,
      name,
      permissions: isValidUser.permissions,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.body;

    await db.User.update(req.body, {
      where: {
        id,
      },
      transaction,

    });
    // ADD AUDIT
    await db.Audit.create({
      action: 'Update',
      area: 'user',
      description: `Updated user ${id}`,
      userId: req.user.userId,
      reference: id,
    }, { transaction });

    await transaction.commit();
    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();

    res.sendStatus(500);
  }
});

async function updatePassword(req, res, next) {
  try {
    const { id } = req.body;
    const password = await bcrypt.hash(req.body.password, 10);

    await db.User.update({
      password,
    }, {
      where: {
        id,
      },
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}

router.put('/status', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id, status } = req.body;

    await db.User.update({
      status,
    }, {
      where: {
        id,
      },
    });

    // ADD AUDIT
    await db.Audit.create({
      action: 'Update',
      area: 'User',
      description: `Updated user status to ${status} in user ${id}`,
      userId: req.user.userId,
      reference: id,
    }, { transaction });

    await transaction.commit();
    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();
    res.sendStatus(500);
  }
});

module.exports = router;
