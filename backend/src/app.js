const express = require("express");
const session = require("express-session")
const cors = require("cors");
const usersRouter = require("./modules/users/users.router");
const authRouter = require("./modules/auth/auth.router");
const subscriptionRouter = require("./modules/subscribtion/subscription.router");

const app = express();

app.use(express.json());
app.use(session({
	secret: "key",
	resave: false,
	saveUninitialized: false,
	cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 },
}));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/subscriptions", subscriptionRouter);

module.exports = app;
