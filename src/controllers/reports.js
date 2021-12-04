const moment = require("moment");
const express = require("express");
const db = require("../models");

const router = express.Router();
const { Op } = db.Sequelize;

router.post("/bugStatus", async (req, res) => {
  try {
    const { startDate, endDate, bugStatus } = req.body;
    const data = await db.bug.findAll({
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
        status: { [Op.in]: bugStatus },
      },
      include: [
        {
          model: db.project,
          attributes: ["title"],
        },
        {
          model: db.User,
          as: "assigneeId",
          attributes: ["first_name", "last_name"],
        },
        {
          model: db.User,
          as: "assignedToId",
          attributes: ["first_name", "last_name"],
        },
      ],
      // logging:console.log
    });
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/devProgress", async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      devsList,
      environment,
      severity,
      componentType,
    } = req.body;
    let { bugStatus } = req.body;
    if (bugStatus[0] === "All") {
      bugStatus = [
        "Canceled",
        "Done",
        "Re-opened",
        "Testing",
        "Ready for testing",
        "Dev done",
        "In-progress",
        "Open",
      ];
    }
    const query = {
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },

        status: { [Op.in]: bugStatus },
        environment,
        severity,
      },
      include: [
        {
          model: db.project,
          attributes: ["title"],
        },
        {
          model: db.User,
          as: "assigneeId",
          attributes: ["first_name", "last_name"],
        },
        {
          model: db.User,
          as: "assignedToId",
          attributes: ["first_name", "last_name"],
        },
      ],
    };

    if (componentType === "developer") {
      query.where.assignedTo = { [Op.in]: devsList };
    } else {
      query.where.assignee = { [Op.in]: devsList };
    }

    const data = await db.bug.findAll(query);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/bugsByProject", async (req, res) => {
  try {
    const { startDate, endDate, projectId, bugStatus, environment, severity } =
      req.body;

    const query = {
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },

        status: { [Op.in]: bugStatus },
        environment,
        severity,
      },
      include: [
        {
          model: db.project,
          attributes: ["title"],
          where: {
            id: projectId,
          },
        },
        {
          model: db.User,
          as: "assigneeId",
          attributes: ["first_name", "last_name"],
        },
        {
          model: db.User,
          as: "assignedToId",
          attributes: ["first_name", "last_name"],
        },
      ],
    };

    const data = await db.bug.findAll(query);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/userReport", async (req, res) => {
  try {
    const { startDate, endDate, userRoles, userStatus } = req.body;

    const query = {
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },

        status: { [Op.in]: userStatus },
        role: { [Op.in]: userRoles },
      },
    };

    const data = await db.User.findAll(query);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/bugSummary", async (req, res) => {
  try {
    // qaList:this.qaList,
    // devsList:this.devsList
    const {
      startDate,
      endDate,
      projectId,
      bugStatus,
      environment,
      severity,
      qaList,
      devsList,
    } = req.body;
    const query = {
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
        status: { [Op.in]: bugStatus },
        environment,
        severity,
        projectId,
        assignedTo: { [Op.in]: devsList },
        assignee: { [Op.in]: qaList },
      },
      include: [
        {
          model: db.User,
          as: "assigneeId",
          attributes: ["first_name", "last_name"],
        },
        {
          model: db.User,
          as: "assignedToId",
          attributes: ["first_name", "last_name"],
        },
      ],
    };

    const data = await db.bug.findAll(query);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/bugsByProject2", async (req, res) => {
  try {
    const { startDate, endDate, projectId, environment, severity } = req.body;
    let { bugStatus } = req.body;

    if (bugStatus[0] === "All") {
      bugStatus = [
        "Canceled",
        "Done",
        "Re-opened",
        "Testing",
        "Ready for testing",
        "Dev done",
        "In-progress",
        "Open",
      ];
    }
    const query = {
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },

        status: { [Op.in]: bugStatus },
        environment,
        severity,
      },
      include: [
        {
          model: db.User,
          as: "assigneeId",
          attributes: ["first_name", "last_name"],
        },
        {
          model: db.User,
          as: "assignedToId",
          attributes: ["first_name", "last_name"],
        },
      ],
    };

    const data = await db.bug.findAll(query);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/sr", async (req, res) => {
  try {
    const data = req.body;

    const preparedQuery = {
      include: [
        {
          model: db.Invoice_master,
          include: [
            {
              model: db.customer,
            },
          ],
        },
      ],
    };
    if (!data.is_all_customers) {
      preparedQuery.include[0].include[0].where = {};
      preparedQuery.include[0].include[0].where.id = data.customer_id;
    }
    if (!data.is_all_dates) {
      preparedQuery.where = {};
      preparedQuery.where.createdAt = {};
      preparedQuery.where.createdAt.$between = [];
      preparedQuery.where.createdAt.$between.push(data.from);
      preparedQuery.where.createdAt.$between.push(data.to);
    }

    const data2 = await db.Sales_return_master.findAll(preparedQuery);
    res.status(200).json({
      data2,
      data,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/invoice", async (req, res) => {
  try {
    const data = req.body;

    const preparedQuery = {
      include: [
        {
          model: db.customer,
        },
      ],
    };
    if (!data.is_all_customers) {
      preparedQuery.include[0].where = {};
      preparedQuery.include[0].where.id = data.customer_id;
    }
    if (!data.is_all_dates) {
      preparedQuery.where = {};
      preparedQuery.where.createdAt = {};
      preparedQuery.where.createdAt.$between = [];
      preparedQuery.where.createdAt.$between.push(data.from);
      preparedQuery.where.createdAt.$between.push(data.to);
    }

    const data2 = await db.Invoice_master.findAll(preparedQuery);
    res.status(200).json({
      data2,
      data,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/pr", async (req, res) => {
  try {
    const data = req.body;

    const preparedQuery = {
      include: [
        {
          model: db.Grn_master,
          include: [
            {
              model: db.customer,
            },
          ],
        },
      ],
    };
    if (!data.is_all_suppliers) {
      preparedQuery.include[0].include[0].where = {};
      preparedQuery.include[0].include[0].where.id = data.supplier_id;
    }
    if (!data.is_all_dates) {
      preparedQuery.where = {};
      preparedQuery.where.createdAt = {};
      preparedQuery.where.createdAt.$between = [];
      preparedQuery.where.createdAt.$between.push(data.from);
      preparedQuery.where.createdAt.$between.push(data.to);
    }

    const data2 = await db.Purchase_return_master.findAll(preparedQuery);
    res.status(200).json({
      data2,
      data,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/grn", async (req, res) => {
  try {
    const data = req.body;

    const preparedQuery = {
      include: [
        {
          model: db.customer,
        },
      ],
    };
    if (!data.is_all_suppliers) {
      preparedQuery.include[0].where = {};
      preparedQuery.include[0].where.id = data.supplier_id;
    }
    if (!data.is_all_dates) {
      preparedQuery.where = {};
      preparedQuery.where.createdAt = {};
      preparedQuery.where.createdAt.$between = [];
      preparedQuery.where.createdAt.$between.push(data.from);
      preparedQuery.where.createdAt.$between.push(data.to);
    }

    const data2 = await db.Grn_master.findAll(preparedQuery);
    res.status(200).json({
      data2,
      data,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

async function todayTransactions(req, res, next) {
  try {
    const today_grn = await db.Grn_master.findAll({
      where: {
        createdAt: {
          [Op.gte]: db.Sequelize.fn("CURRENT_DATE"),
        },
        //  db.Sequelize.fn('CURRENT_DATE')
      },
      include: [
        {
          model: db.customer,
        },
      ],
    });

    const today_invoice = await db.Invoice_master.findAll({
      where: {
        // createdAt: db.Sequelize.fn('CURRENT_DATE')
        createdAt: {
          [Op.gte]: db.Sequelize.fn("CURRENT_DATE"),
        },
      },
      include: [
        {
          model: db.customer,
        },
      ],
    });

    const today_pr = await db.Purchase_return_master.findAll({
      where: {
        // createdAt: db.Sequelize.fn('CURRENT_DATE')
        createdAt: {
          [Op.gte]: db.Sequelize.fn("CURRENT_DATE"),
        },
      },
      include: [
        {
          model: db.Grn_master,
          include: [
            {
              model: db.customer,
            },
          ],
        },
      ],
    });

    const today_sr = await db.Sales_return_master.findAll({
      where: {
        // createdAt: db.Sequelize.fn('CURRENT_DATE')
        createdAt: {
          [Op.gte]: db.Sequelize.fn("CURRENT_DATE"),
        },
      },
      include: [
        {
          model: db.Invoice_master,
          include: [
            {
              model: db.customer,
            },
          ],
        },
      ],
    });

    res.status(200).json({
      today_grn,
      today_invoice,
      today_pr,
      today_sr,
    });
  } catch (error) {
    res.sendStatus(500);
  }
}

const calculateProgress = (value) => {
  let totalValue = 0;
  if (value === "Blocker") {
    totalValue = 150;
  }
  if (value === "Critical") {
    totalValue = 125;
  }
  if (value === "Major") {
    totalValue = 100;
  }
  if (value === "Minor") {
    totalValue = 75;
  }
  if (value === "Trivial") {
    totalValue = 50;
  }
  if (value === "Enhancement") {
    totalValue = 25;
  }
  return totalValue;
};

router.post("/progressReport", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const query = {
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      include: [
        {
          model: db.User,
          as: "assignedToId",
          attributes: ["first_name", "last_name"],
        },
      ],
    };
    const data = await db.bug.findAll(query);
    let arr = [];
    data.forEach((item) => {
      const value = calculateProgress(item.severity);
      const id = item.assignedTo;
      const a = 0;
      const name = `${item.assignedToId.first_name} ${item.assignedToId.last_name}`;
      const obj = { name, id, totalCredit: value, lengthCount: 1, avg: 0 };

      arr.push(obj);
    });
    const results = [];
    arr.forEach((item) => {
      const isExists = results.findIndex((e) => e.id === item.id);
      if (isExists >= 0) {
        results[isExists].totalCredit += item.totalCredit;
        results[isExists].lengthCount += 1;
        results[isExists].avg =
          results[isExists].totalCredit / results[isExists].lengthCount;
      } else {
        results.push(item);
      }
    });
    res.status(200).json({ results });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
