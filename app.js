// ----------------- IMPORT DATA FROM ANOTHER FILES ----------------------------------
import { productsObjList, usersObjList } from "./valuesObj.mjs";

import { createRequire } from "module";
import e, { query } from "express";
const require = createRequire(import.meta.url);

import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
// ===================================================================================

const express = require("express");
const app = express();
const mysql = require("mysql");

const { join } = require("path");
app.set("views", join(__dirname, "views"));
app.set("view engien", "ejs");
app.use(express.static(join(__dirname, "/public")));
app.use(express.static("."));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "animal_shop",
});

const PORT = 3000;

// Global conaction function
let connectionFunc = (query) => {
  connection.query(query, (err, result) => {
    if (err) console.log(err);
    console.log(result);
  });
};

// Insert "productsObjList" into products table

let insertIntoProduct = `INSERT INTO \`products\` (\`title\`, \`animal\`, \`category\`, \`description\`, \`price\`, \`image\`) VALUES`;
let productsValues = "";

productsObjList.forEach((product, index) => {
  let comma = index === productsObjList.length - 1 ? ";" : ",";
  productsValues += `('${product.title}','${product.animal}','${product.category}','${product.description}',${product.price},'${product.image}')${comma}`;
});

let productQuery = insertIntoProduct + productsValues;

let insertProducts = () => {
  let insert = productQuery;

  connectionFunc(insert);
};
// insertProducts();  // <= Enable to call the insert function

// Insert "usersObjList" into products table

let insertIntoUsers = `INSERT INTO \`users\` (\`first_name\`, \`last_name\`, \`mail\`, \`psw\`, \`admin\`) VALUES`;
let usersValues = "";

usersObjList.forEach((user, index) => {
  let comma = index === usersObjList.length - 1 ? ";" : ",";
  usersValues += `('${user.first_name}','${user.last_name}','${user.mail}','${user.psw}',${user.admin})${comma}`;
});

let usersQuery = insertIntoUsers + usersValues;

let insertUsers = () => {
  let insert = usersQuery;

  connectionFunc(insert);
};
// insertUsers(); // <= Enable to call the insert function

// ----------------------------- END POINDS SECTION ----------------------------------

// render main products page
app.get("/homepage", async (req, res) => {
  let query = `SELECT * FROM products`;
  await connection.query(query, (err, result) => {
    if (err) console.log(err);

    res.render("index.ejs", { result });
  });
});

// Update item nuvegation
app.get("/update/:id/:title", (req, res) => {
  let prodId = req.params.id;
  let prodName = req.params.title;

  let query = `SELECT * FROM products
  WHERE \`id\` = ${prodId}`;

  connection.query(query, (err, result) => {
    if (err) console.log(err);

    res.render("updatProd.ejs", { result });
  });
});

// Update item
app.post("/update/:id", (req, res) => {
  let id = req.params.id;
  let { title, animal, category, description, price, image } = req.body;
  let query = `UPDATE products
  SET \`title\` = "${title}", \`animal\` = "${animal}", \`category\` = "${category}", \`description\` = "${description}", \`price\` = ${price}, \`image\` = "${image}"
  WHERE \`id\` = ${id};`;

  connectionFunc(query);
  res.redirect("/homepage");
});

// Delete item
app.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  let query = `DELETE FROM products
  WHERE \`id\` = ${id};`;

  connectionFunc(query);
  res.redirect("/homepage");
});

// Add product navegation
app.get("/addProduct", (req, res) => {
  res.render("addProd.ejs");
});

// Adding new product
app.post("/addProduct", (req, res) => {
  let { title, animal, category, description, price, image } = req.body;
  let query = `INSERT INTO products (\`title\`, \`animal\`, \`category\`, \`description\`, \`price\`, \`image\`)
  VALUES ('${title}','${animal}','${category}','${description}',${price},'${image}');`;

  connectionFunc(query);
  res.redirect("/homepage");
});

// Add to cart
app.post("/list/:cartId/:prodId/:prodPrice", (req, res) => {
  let { cartId, prodId, prodPrice } = req.params;
  let { total_prod } = req.body;
  cartId = Math.floor(Math.random() * 3) + 1;

  let priceSum = +prodPrice * total_prod;

  let userId = 2;

  let query = `INSERT INTO \`cart\`( \`cart_id\`, \`user_id\`, \`prod_id\`, \`prod_quantity\`, \`price_sum\`) VALUES (${cartId},${userId},${prodId},${total_prod},${priceSum})`;

  connectionFunc(query);
  res.redirect("/homepage");
});

// Checkout button
app.get("/cart/:cartId", (req, res) => {
  let cartId = Math.floor(Math.random() * 3) + 1;
  let query = `SELECT \`cart_id\`, \`prod_quantity\`, \`price_sum\`, users.first_name, users.last_name, products.title, products.image FROM \`cart\`
  JOIN users
  ON cart.user_id = users.user_id
  INNER JOIN products
  ON cart.prod_id = products.id
  WHERE cart.cart_id = ${cartId}`;

  connection.query(query, (err, result) => {
    if (err) console.log(err);

    res.render("cart.ejs", { result });
  });
});

// ===================================================================================

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
