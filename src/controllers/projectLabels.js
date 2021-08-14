const express = require("express");
const db = require("../models");

const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

router.post("/", checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    let colorCode;
    switch (req.body.labelType) {
      case "Security":
        colorCode = "red";
        break;
      case "Feature":
        colorCode = "blue";
        break;
      case "Maintenance":
        colorCode = "orange";

        break;

      case "Think / Check":
        colorCode = "teal";
        break;
      case "Design":
        colorCode = "purple";
        break;
      case "Visuals":
        colorCode = "Visuals";
        break;
      case "Infrastructure":
        colorCode = "Infrastructure";
        break;

      default:
        break;
    }
    req.body.colorCode = colorCode;
    const item = await db.project_label.create(req.body, { transaction });

    // ADD AUDIT
    await db.Audit.create(
      {
        action: "Create",
        area: "label",
        description: `Created label ${item.dataValues.id}`,
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
    const data = await db.project_label.findAll({});

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.project_label.findOne({
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
    await db.project_label.update(
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
    let colorCode;
    switch (req.body.labelType) {
      case "Security":
        colorCode = "red";
        break;
      case "Feature":
        colorCode = "blue";
        break;
      case "Maintenance":
        colorCode = "orange";

        break;

      case "Think / Check":
        colorCode = "teal";
        break;
      case "Design":
        colorCode = "purple";
        break;
      case "Visuals":
        colorCode = "green";
        break;
      case "Infrastructure":
        colorCode = "pink";
        break;

      default:
        break;
    }
    req.body.colorCode = colorCode;
    await db.project_label.update(data, {
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
