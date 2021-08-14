const express = require("express");
const db = require("../models");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.post("/", async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const data = await db.bug.create(req.body, { transaction });

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

    await transaction.commit();
    console.log("REQ.BODY", data);
    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();
    console.log(error);

    res.sendStatus(500);
  }
});

router.get("/", checkAuth, async (req, res) => {
  try {
    const role = req.user.role;
    const filter = {
      include: [
        {
          model: db.User,
          as: "assigneeId",
          attributes: ["title", "first_name", "last_name", "fullName"],
        },
        {
          model: db.User,
          as: "assignedToId",
          attributes: ["title", "first_name", "last_name", "fullName"],
        },
        {
          model: db.project,
        },
      ],
    };
    if (role === "dev") {
      filter.include[1].where = {
        id: req.user.userId,
      };
    }
    const data = await db.bug.findAll(filter);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", checkAuth, async (req, res) => {
  try {
    const role = req.user.role;
    const filter = {
      where:{
        id:req.params.id
      },
      include: [
        {
          model: db.User,
          as: "assigneeId",
          attributes: ["title", "first_name", "last_name", "fullName"],
        },
        {
          model: db.User,
          as: "assignedToId",
          attributes: ["title", "first_name", "last_name", "fullName"],
        },
        {
          model: db.project,
        },
      ],
    };
    // if (role === 'dev') {
    //   filter.include[1].where = {
    //     id: req.user.userId,
    //   };

    // }
    const data = await db.bug.findOne(filter);
    console.log("data",data)
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const data = await db.bug.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    await transaction.commit();
    console.log("REQ.BODY", data);
    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();
    console.log(error);

    res.sendStatus(500);
  }
});

module.exports = router;
