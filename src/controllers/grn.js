const express = require('express');
const db = require('../models');

const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const e = require('express');

router.get('/qr/:id', checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const queryUnique = `SELECT 
    Stocks.id,
    items.description,
    items.name,
    categories.name AS CAT
FROM
    inventory.Stocks
        INNER JOIN
    items ON Stocks.item_id = items.id
        INNER JOIN
    categories ON items.categoryId = categories.id
WHERE
    grnId = ${id};`;

    const queryBulk = `SELECT 
    Stocks.id,
    items.description,
    items.name,
    categories.name AS CAT,
    Grn_details.qty
FROM
    inventory.Grn_details
        INNER JOIN
    items ON Grn_details.item_id = items.id
        INNER JOIN
    Stocks ON items.id = Stocks.item_id
        INNER JOIN
    categories ON items.categoryId = categories.id
WHERE
    grn_master_id = ${id} AND bulkQR = TRUE`;

    const unique = await db.sequelize.query(queryUnique, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    const bulk = await db.sequelize.query(queryBulk, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    const data = [];
    if (unique.length) {
      unique.forEach((e) => {
        data.push({
          margin: [5, 2, 10, 20],
          columns: [
            [
              { text: `Category : ${e.CAT}` },
              { text: `Product : ${e.name}` },
              { text: `Description : ${e.description}` },
            ],
            [{ qr: `${e.id}` }],
          ],
        });
      });
    }

    if (bulk.length) {
      bulk.forEach((e) => {
        for (let index = 0; index < e.qty; index++) {
          data.push({
            margin: [5, 2, 10, 20],
            columns: [
              [
                { text: `Category : ${e.CAT}` },
                { text: `Product : ${e.name}` },
                { text: `Description : ${e.description}` },
              ],
              [{ qr: `${e.id}` }],
            ],
          });
        }
      });
    }

    const dd = {
      content: data,
    };

    console.log('unique', dd.content[0].columns);

    res.status(200).json({ dd });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/util', checkAuth, async (req, res) => {
  try {
    // ACTIVE SUPPLIERS && ACTIVE PRODUCTS
    const [suppliers, products] = await Promise.all([
      db.customer.findAll({
        where: {
          status: true,
          type: 'supplier',
        },
      }),
      db.item.findAll({
        where: {
          status: true,
        },
      }),
    ]);

    res.status(200).json({
      suppliers,
      products,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const create = await db.Grn_master.create(
      {
        supplier_id: req.body.supplier_id,
      },
      { transaction },
    );

    const { grn } = req.body;

    grn.forEach((element) => {
      element.grn_master_id = create.dataValues.id;
    });

    await db.Grn_detail.bulkCreate(grn, {
      fields: ['unit_price', 'qty', 'item_id', 'grn_master_id'],
      transaction,
    });

    // Check for bulkQR true
    const bulkQR = grn.filter((e) => e.bulkQR);
    for (const element of bulkQR) {
      await db.Stock.update(
        {
          qty: db.Sequelize.literal(`qty + ${element.qty}`),
        },
        {
          where: {
            item_id: element.item_id,
          },
          transaction,
        },
      );
    }

    // Check for bulkQR false
    const uniqueQR = grn.filter((e) => !e.bulkQR);

    const uniqueCodes = [];
    uniqueQR.forEach((item) => {
      for (let index = 0; index < item.qty; index++) {
        uniqueCodes.push({
          qty: 1,
          item_id: item.item_id,
          grnId: create.dataValues.id,
        });
      }
    });

    if (uniqueCodes.length) {
      await db.Stock.bulkCreate(uniqueCodes, { transaction });
    }

    // for (const element of grn) {
    //   await db.Stock.update({
    //     qty: db.Sequelize.literal(`qty + ${element.qty}`),
    //   }, {
    //     where: {
    //       item_id: element.item_id,
    //     },
    //     transaction,
    //   });
    // }

    await db.Audit.create(
      {
        action: 'Create',
        area: 'GRN',
        description: `Created a GRN ${create.dataValues.id}`,
        userId: req.user.userId,
        reference: create.dataValues.id,
      },
      { transaction },
    );
    await transaction.commit();

    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();

    res.sendStatus(500);
  }
});

router.get('/v2/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `(SELECT 
      Stocks.id AS QR,
      items.name,
      Grn_details.qty,
      Stocks.qty AS availableQty,
      Stocks.item_id as item_id,
      items.bulkQR as bulkQR
  FROM
      inventory.Grn_details
          INNER JOIN
      items ON Grn_details.item_id = items.id
          INNER JOIN
      Stocks ON Grn_details.item_id = Stocks.item_id
  WHERE
      grn_master_id = ${id}
          AND items.bulkQR = TRUE) UNION (SELECT 
      Stocks.id AS QR, items.name, qty, 1 AS availableQty, Stocks.item_id as item_id,
      items.bulkQR as bulkQR
  FROM
      inventory.Stocks
          INNER JOIN
      items ON Stocks.item_id = items.id
  WHERE
      grnId = ${id} AND qty > 0)
          `;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/', checkAuth, async (req, res) => {
  try {
    const data = await db.Grn_master.findAll({
      attributes: [
        'id',
        'createdDate',
        'purchaseReturned',
        'status',
        'supplier_id',
        'createdAt',
      ],
      include: [
        {
          model: db.customer,
          attributes: ['id', 'first_name', 'last_name', 'title', 'fullName'],
        },
      ],
      order: db.sequelize.literal('id DESC'),
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const masterDetails = await db.Grn_master.findOne({
      where: {
        id,
      },
      include: [
        {
          model: db.customer,
        },
      ],
    });

    const details = await db.Grn_detail.findAll({
      raw: true,
      where: {
        grn_master_id: id,
      },
      include: [
        {
          model: db.item,
          attributes: ['name', 'measurement_unit'],
          include: [
            {
              model: db.Measurement_units,
            },
          ],
        },
      ],
    });

    details.forEach((element) => {
      element.total = element.qty * element.unit_price;
    });

    res.status(200).json({
      details,
      masterDetails,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
