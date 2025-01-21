const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const authRouter = require("./routes/auth_route.js");
const { ensureAuthenticated } = require("./routes/auth_route.js");
const { admin_router, getWalk } = require("./routes/admin.js");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());

app.use(
  session({
    secret: "your-secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/admin", ensureAuthenticated, admin_router);

app.use("/login", authRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/private", (req, res) => {
  res.render("private");
});

app.get("/weekly", async (req, res) => {
  const result = await getWalk();
  res.render("weekly", { items: result.data });
});

app.get("/crud", ensureAuthenticated, async (req, res) => {
  const result = await getWalk();
  res.render("crud", { items: result.data });
});

//app.listen(3000, () => {
//  console.log("Server running on http://localhost:3000");
//});

module.exports = app;
