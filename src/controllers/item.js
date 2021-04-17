const express = require('express');
const db = require('../models');

const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const item = await db.item.create(req.body, { transaction });

    await db.Stock.create(
      {
        item_id: item.dataValues.id,
      },
      { transaction },
    );

    // ADD AUDIT
    await db.Audit.create(
      {
        action: 'Create',
        area: 'product',
        description: `Created product ${item.dataValues.id}`,
        userId: req.user.userId,
        reference: item.dataValues.id,
      },
      { transaction },
    );

    await transaction.commit();

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    await transaction.rollback();

    res.sendStatus(500);
  }
});

router.get('/', checkAuth, async (req, res) => {
  try {
    const data = await db.item.findAll({
      include: [
        {
          attributes: ['name', 'id'],
          model: db.category,
        },
        {
          model: db.Stock,
        },
        {
          model: db.Measurement_units,
        },
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/stock-item/:id', async (req, res) => {
  try {
    const query = `SELECT 
    items.name, items.selling_price, Stocks.id, items.id AS item_id,items.bulkQR,
    Stocks.qty,
    Stocks.invoiceId
FROM
    inventory.Stocks
        INNER JOIN
    items ON Stocks.item_id = items.id
WHERE
    Stocks.id = ${req.params.id} AND qty >= 1;`;
    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.item.findOne({
      where: {
        id,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/status', async (req, res) => {
  try {
    const { id, status } = req.body;
    await db.item.update(
      {
        status,
      },
      {
        where: {
          id,
        },
      },
    );
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.item.update(data, {
      fields: [
        'measurement_unit',
        'name',
        'selling_price',
        'status',
        'categoryId',
        'reorder_level',
        'description',
        'images',
      ],
      where: {
        id,
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.log('ERR', error);
    res.sendStatus(500);
  }
});

module.exports = router;
