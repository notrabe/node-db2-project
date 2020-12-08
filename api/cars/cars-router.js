const express = require('express');
const db = require('../../data/dbConfig')

const router = express.Router();

const Cars = {
    getAll() {
        return db('cars');
    },
    getById(id) {
        return db("cars").where({ id });
    },
    create(car) {
        return db("cars").insert(car);
    },
    update(id, car) {
        return db("cars").where({ id }).update(car);
    },
    delete(id) {
        return db("cars").where({ id }).del();
    },
};

router.get("/api/cars", (req, res) => {
    Cars.getAll()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/api/cars/:id", (req, res) => {
    Cars.getById(req.params.id)
      .then((data) => {
        res.status(200).json(data[0]);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/api/cars", (req, res) => {
    Cars.create(req.body)
      .then(([id]) => {
        return Cars.getById(id).first();
      })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.put("/api/cars/:id", async (req, res) => {
    try {
      await Cars.update(req.params.id, req.body);
      const updatedCar = await Cars.getById(req.params.id).first();
      res.status(200).json(updatedCar);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete("/api/cars/:id", (req, res) => {
    Cars.delete(req.params.id)
      .then((data) => {
        res.status(200).json({ message: "Car deleted!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  module.exports = router