const express = require('express');
const db = require('../models');

const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

router.get('/util', checkAuth, async (req, res) => {
  try {
    // ACTIVE SUPPLIERS && ACTIVE PRODUCTS
    const [customers, products] = await Promise.all([
      db.customer.findAll({
        where: {
          status: true,
          type: 'customer',
        },
      }),
      db.item.findAll({
        where: {
          status: true,
        },
        include: [
          {
            model: db.Stock,
          },
        ],
      }),
    ]);

    res.status(200).json({
      customers,
      products,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
    (SELECT 
      items.name AS name,
      items.bulkQR,
      Invoice_details.qty,
      Invoice_details.item_id,
      Stocks.id AS QR
  FROM
      inventory.Invoice_details
          INNER JOIN
      items ON Invoice_details.item_id = items.id
          INNER JOIN
      Stocks ON Invoice_details.item_id = Stocks.item_id
  WHERE
      invoice_id = ${id} AND items.bulkQR = TRUE) UNION (SELECT 
      items.name AS name,
      items.bulkQR,
      1 AS qty,
      item_id,
      Stocks.id AS QR
  FROM
      inventory.Stocks
          INNER JOIN
      items ON Stocks.item_id = items.id
  WHERE
      invoiceId = ${id} AND items.bulkQR = FALSE)
  
    `
    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    res.status(200).json(data);
  } catch (error) {
    console.log('Err', error);
    res.status(500).json(error);
  }
});

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  function updateStock(element) {
    if (element.bulkQR) {
      db.Stock.update(
        {
          qty: db.Sequelize.literal(`qty - ${element.qty}`),
        },
        {
          where: {
            item_id: element.item_id,
          },
          transaction,
        },
      );
    } else {
      db.Stock.update(
        {
          qty: 0,
          invoiceId: element.invoice_id,
        },
        {
          where: {
            id: element.id,
          },
          transaction,
        },
      );
    }
  }

  try {
    const {
      invoice,
      billNo,
      referenceNo,
      deliveryCost,
      customerId,
      address,
      phoneNumber,
    } = req.body;

    // Create a record in invoice_master table

    const create = await db.Invoice_master.create(
      {
        customer_id: customerId,
        deliveryCost,
      },
      { transaction },
    );

    // attach the invoice master id for every record

    for (let index = 0; index < invoice.length; index += 1) {
      invoice[index].invoice_id = create.dataValues.id;
      invoice[index].qty = 1;
      invoice[index].unit_price = invoice[index].selling_price;
      invoice[index].serialNumber = invoice[index].id;
    }

    // insert records to the invoice_details table

    await db.Invoice_detail.bulkCreate(invoice, {
      fields: [
        'unit_price',
        'qty',
        'invoice_id',
        'item_id',
        'serialNumber',
        'createdAt',
        'updatedAt',
      ],
      transaction,
    });

    // Update the stock table

    await Promise.allSettled(invoice.map(updateStock));

    // sending success response

    await db.Audit.create(
      {
        action: 'Create',
        area: 'invoice',
        description: `Created an invoice ${create.dataValues.id}`,
        userId: req.user.userId,
        reference: create.dataValues.id,
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

router.get('/', async (req, res) => {
  try {
    let data = await db.Invoice_master.findAll({
      include: [
        {
          model: db.customer,
          attributes: ['id', 'first_name', 'title', 'last_name', 'fullName'],
        },
        {
          model: db.Invoice_detail,
        },
      ],
      order: db.sequelize.literal('id DESC'),
    });
    console.log('data', data);
    data = data.map((el) => el.get({ plain: true }));

    for (let index = 0; index < data.length; index += 1) {
      const subTotal = Number(
        data[index].Invoice_details.map((e) => e.qty * e.unit_price).reduce(
          (a, b) => a + b,
          0,
        ),
      ).toFixed(2);
      data[index].subTotal = subTotal;

      data[index].total = (
        Number(subTotal) + Number(data[index].deliveryCost)
      ).toFixed(2);
    }

    res.status(200).json(data);
  } catch (error) {
    console.warn(error);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const masterData = await db.Invoice_master.findOne({
      where: {
        id,
      },
      include: [
        {
          model: db.customer,
        },
      ],
    });

    const details = await db.Invoice_detail.findAll({
      where: {
        invoice_id: id,
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
    res.status(200).json({
      details,
      masterData,
    });
  } catch (error) {
    console.log('Err', error);
    res.status(500).json(error);
  }
});

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const update = await db.invoice.update(
      {},
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
}

async function status(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.params;

    const change_status = await db.invoice.update(
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
}

module.exports = router;
