const express = require('express');
const db = require('../models');

const { Op } = db.Sequelize;
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const data = await db.category.create(req.body, { transaction });
    // ADD AUDIT
    await db.Audit.create({
      action: 'Create',
      area: 'category / subcategory',
      description: `Created category / subcategory ${data.dataValues.id}`,
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

router.get('/readById/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db.category.findOne({
      where: {
        id,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/:type/:status', async (req, res) => {
  try {
    const query = {
      raw: true,
      attributes: ['id', 'name', 'description', 'status'],
      where: {},
    };
    const { type, status } = req.params;
    if (type === 'category') {
      query.where.parentId = {
        [Op.eq]: null,
      };
    }
    if (type === 'subcategory') {
      query.where.parentId = {
        [Op.ne]: null,

      };
      query.include = [{
        model: db.category,
        as: 'parent',
        attributes: ['name'],
      }];
    }
    if (status === 'active') {
      query.where.status = true;
    }

    const data = await db.category.findAll(query);

    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.put('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      id, name, status, description,
    } = req.body;

    await db.category.update({ name, status, description }, {
      fields: ['name', 'description', 'status'],
      where: {
        id,
      },
      transaction,
    });

    // ADD AUDIT
    await db.Audit.create({
      action: 'Update',
      area: 'category / subcategory',
      description: `Updated in ${id}`,
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

router.put('/status', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id, status } = req.body;

    await db.category.update({
      status,
    }, {
      where: {
        id,
      },
      transaction,
    });

    // ADD AUDIT
    await db.Audit.create({
      action: 'Update',
      area: 'category / subcategory',
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

module.exports = router;
