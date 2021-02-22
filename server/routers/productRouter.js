const router = require("express").Router();
const Product = require("../models/productModel");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    const newProduct = new Product({
      name,
    });

    const savedProduct = await newProduct.save();

    res.json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
