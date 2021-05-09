const express = require("express");
const db = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
  //   const transaction = await db.sequelize.transaction();
  try {
    // const data = await db.customer.create(req.body, { transaction });

    // await db.Audit.create(
    //   {
    //     action: "Create",
    //     area: req.body.type,
    //     description: `Created ${req.body.type} ${data.dataValues.id}`,
    //     userId: req.user.userId,
    //     reference: data.dataValues.id,
    //   },
    //   { transaction }
    // );

    // await transaction.commit();
    console.log("REQ.BODY", req.body);
    res.sendStatus(200);
  } catch (error) {
    // await transaction.rollback();

    res.sendStatus(500);
  }
});

module.exports = router;
