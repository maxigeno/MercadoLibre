const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  // Root - Show all products
  index: (req, res) => {
    res.render("products", {
      products,
      toThousand,
    });
  },

  // Detai
  detail: (req, res) => {
    let id = req.params.id;
    let product = products.find((product) => product.id == id);
    res.render("detail", {
      product,
      toThousand,
    });
  },

  // Create Form
  create: (req, res) => {
    res.render("product-create-form");
  },

  // Create Method POST
  store: (req, res) => {
    let image;
    if (req.file != undefined) {
      image = req.file.filename;
    } else {
      image = "default-image.png";
    }
    let newProduct = {
      id: products[products.length - 1].id + 1,
      ...req.body,
      image,
    };
    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, " "));
    res.redirect("/");
  },

  // Update  Form to edit
  edit: (req, res) => {
    let id = req.params.id;
    let productToEdit = products.find((product) => product.id == id);
    res.render("product-edit-form", { productToEdit });
  },
  // Update - Method to update
  update: (req, res) => {
    console.log("req.params.id", req.params.id);
    let id = req.params.id;
    let productToEdit = products.find((product) => product.id == id);
    console.log("productToEdit", productToEdit);
    let image;

    if (req.file != undefined) {
      image = req.file.filename;
    } else {
      image = "default-image.png";
    }

    productToEdit = {
      id: productToEdit.id,
      ...req.body,
      image,
    };

    let newProducts = products.map((product) => {
      if (product.id == productToEdit.id) {
        return (product = { ...productToEdit });
      }
      return product;
    });

    fs.writeFileSync(productsFilePath, JSON.stringify(newProducts, null, " "));
    res.redirect("/");
  },

  // Delete one product from DB
  destroy: (req, res) => {
    let id = req.params.id;
    let finalProducts = products.filter((product) => product.id != id);
    fs.writeFileSync(
      productsFilePath,
      JSON.stringify(finalProducts, null, " ")
    );
    res.redirect("/");
  },
};

module.exports = controller;
