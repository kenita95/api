const express = require('express');
const db = require('../models');

const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    // 1. Add record to pr master table.
    const prMaster = await db.Purchase_return_master.create({
      grn_number: req.body.grn_number,
    }, { transaction });

    // 2. Update status to false in GRN master table. (Purchase return is made for this GRN)

    await db.Grn_master.update({
      status: 0,
    }, {
      where: {
        id: req.body.grn_number,
      },
      transaction,
    });

    const prId = prMaster.dataValues.id;

    const prList = req.body.pr;

    prList.forEach((element) => {
      element.pr_number = prId;
    });

    // 3. add records to pr details table.

    await db.Purchase_return_detail.bulkCreate(prList, {
      fields: ['qty', 'item_id', 'pr_number', 'createdAt', 'updatedAt', 'return_qty'],
      transaction,
    });

    // 4. Update qty in stock table.

    const bulkQR = prList.filter(e=> e.bulkQR);

    for (const element of bulkQR) {
      db.Stock.update({

        qty: db.Sequelize.literal(`qty - ${element.return_qty}`),
      }, {
        where: {
          item_id: element.item_id,
        },
        transaction,
      });
    }

    const uniqueQR = prList.filter(e=> !e.bulkQR);

    for (const element of uniqueQR) {
      await db.Stock.update(
        {
          qty: 0,
          PrId: element.pr_number,
        },
        {
          where: {
            id: element.QR,
          },
          transaction,
        },
      );
     
    }


   

    await db.Audit.create({
      action: 'Create',
      area: 'Purchase return',
      description: `Created a Purchase return ${prMaster.dataValues.id}`,
      userId: req.user.userId,
      reference: prMaster.dataValues.id,
    }, { transaction });
    await transaction.commit();

    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();
    console.log('ERROR', error);
    res.sendStatus(500);
  }
});

router.get('/', checkAuth, async (req, res) => {
  try {
    const data = await db.Purchase_return_master.findAll({
      attributes: ['id', 'createdDate', 'createdAt', 'grn_number'],
      include: [{
        model: db.Grn_master,
        attributes: ['id'],
        include: [{
          model: db.customer,
          attributes: ['id', 'first_name', 'last_name', 'title', 'fullName'],
        }],
      }],
    });

    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/:id', checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const masterData = await db.Purchase_return_master.findOne({
      where: {
        id,
      },
      include: [{
        model: db.Grn_master,
        include: [{
          model: db.customer,
        }],
      }],
    });
    const details = await db.Purchase_return_detail.findAll({
      where: {
        pr_number: id,
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
      details,
      masterData,
    });
  } catch (error) {
    console.log('ERROR', error);
    res.sendStatus(500);
  }
});

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const update = await db.purchase_return.update({}, {
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

    const change_status = await db.purchase_return.update({
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

module.exports = router;
