const express = require("express");
const db = require("../models");

const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

router.post("/", checkAuth, async (req, res) => {
  try {
    req.body.userId = req.user.userId;
    await db.comment.create(req.body);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);

    res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.comment.findAll({
      where: {
        bugId: id,
      },
      include: [
        {
          model: db.User,
          attributes: ["title", "first_name", "last_name", "fullName"],
        },
      ],
      order: db.sequelize.literal("createdAt DESC"),
    });
    res.status(200).json(data);
  } catch (error) {
      console.log(error)
    res.status(500).json(error);
  }
});

module.exports = router;
