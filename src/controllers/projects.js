const express = require("express");
const db = require("../models");

const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

router.post("/", checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const item = await db.project.create(req.body, { transaction });

    // ADD AUDIT
    await db.Audit.create(
      {
        action: "Create",
        area: "project",
        description: `Created project ${item.dataValues.id}`,
        userId: req.user.userId,
        reference: item.dataValues.id,
      },
      { transaction }
    );

    await transaction.commit();

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    await transaction.rollback();

    res.sendStatus(500);
  }
});

router.get("/", checkAuth, async (req, res) => {
  try {
    const data = await db.project.findAll({
      include: [
        
        {
          model: db.User,
          as:"pm",
          attributes:['title','first_name','last_name','fullName']
        },
        {
          model: db.User,
          as:"lead",
          attributes:['title','first_name','last_name','fullName']
        },
        
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.project.findOne({
      where: {
        id,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/status", async (req, res) => {
  try {
    const { id, status } = req.body;
    await db.project.update(
      {
        status,
      },
      {
        where: {
          id,
        },
      }
    );
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.project.update(data, {
      where: {
        id,
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.log("ERR", error);
    res.sendStatus(500);
  }
});

module.exports = router;
