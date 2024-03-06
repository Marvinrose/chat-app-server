const router = require("express").Router();

const authRoute = require("./auth");

const userRoute = require("./user");

router.post("/auth", authRoute);

router.post("/user", userRoute);
