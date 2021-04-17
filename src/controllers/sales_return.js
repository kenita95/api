const express = require('express');
const db = require('../models');

const router = express.Router();
async function create(req, res, next) {
  try {
    const { sr } = req.body;

    const create = await db.Sales_return_master.create({
      invoice_number: req.body.invoice_number,
    });

    sr.forEach((element) => {
      element.sr_number = create.dataValues.id;
      element.return_qty = element.return_qty;
    });

    await db.Sales_return_detail.bulkCreate(sr, {
      fields: ['return_qty', 'item_id', 'sr_number', 'createdAt', 'updatedAt'],
    });

    sr.forEach((element) => {
      db.Stock.update({
        qty: db.Sequelize.literal(`qty + ${element.return_qty}`),
      }, {
        where: {
          item_id: element.item_id,
        },
      });
    });

    await db.Invoice_master.update({
      status: 0,
    }, {
      where: {
        id: req.body.invoice_number,
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).json(error);
  }
}

async function read(req, res, next) {
  try {
    const read = await db.Sales_return_master.findAll({
      include: [{
        model: db.Invoice_master,
        include: [{
          model: db.customer,
        }],
      }],
      order: db.sequelize.literal('createdAt DESC'),
    });

    res.status(200).json(read);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
async function read_by_id(req, res, next) {
  try {
    const { id } = req.params;

    const meta_data = await db.Sales_return_master.findOne({
      raw: true,
      where: {
        id,
      },
      include: [{
        model: db.Invoice_master,
        include: [{
          model: db.customer,
        }],
      }],
    });
    const read_by_id = await db.Sales_return_detail.findAll({
      raw: true,
      where: {
        sr_number: id,
      },
      include: [{
        model: db.item,
        attributes: ['name', 'measurement_unit'],
        include: [{
          model: db.Measurement_units,
        }],
      }],
    });

    res.status(200).json({
      meta_data,
      read_by_id,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const update = await db.sales_return.update({}, {
      where: {
        id,
      },
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function status(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.params;

    const change_status = await db.sales_return.update({
      status,
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

async function getAllSrCustomers() {
  try {
    const data = await db.Sales_return_master.findAll({
      include: [{
        model: db.Invoice_master,
        include: [{
          model: db.customer,
        }],
      }],
    });
  } catch (error) {

  }
}

module.exports = router;
