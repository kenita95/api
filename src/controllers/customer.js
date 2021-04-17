const express = require('express');
const db = require('../models');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const data = await db.customer.create(req.body, { transaction });

    // ADD AUDIT
    await db.Audit.create({
      action: 'Create',
      area: req.body.type,
      description: `Created ${req.body.type} ${data.dataValues.id}`,
      userId: req.user.userId,
      reference: data.dataValues.id,
    }, { transaction });

    await transaction.commit();
    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();

    res.sendStatus(500);
  }
});

router.get('/:type', async (req, res) => {
  try {
    const data = await db.customer.findAll({
      attributes: ['id', 'customer_type', 'contact_number', 'nic', 'status', 'title', 'first_name', 'last_name', 'fullName'],
      where: {
        type: req.params.type,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/readById/:id', checkAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db.customer.findOne({
      where: {
        id,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.put('/status', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id, status } = req.body;
    await db.customer.update({
      status,
    }, {
      where: {
        id,
      },
    });

    // ADD AUDIT
    await db.Audit.create({
      action: 'Update',
      area: 'customer/supplier',
      description: `Updated status to ${status} in ${id}`,
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

router.put('/:id', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;

    await db.customer.update(req.body, {
      where: {
        id,
      },
      transaction,
    });

    // ADD AUDIT
    await db.Audit.create({
      action: 'Update',
      area: req.body.type,
      description: `Updated ${req.body.type} ${id}`,
      userId: req.user.userId,
      reference: id,
    }, { transaction });

    await transaction.commit();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    res.sendStatus(500);
  }
});

module.exports = router;
