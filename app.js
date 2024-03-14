const express = require("express");

const routes = require("./routes/index");

const morgan = require("morgan"); //  is a popular middleware for logging HTTP requests in Node.js web applications.

const rateLimit = require("express-rate-limit"); //  Use to limit repeated requests to public APIs and/or endpoints such as password reset.

const helmet = require("helmet"); // Helmet helps secure Express apps by setting HTTP response headers.

const mongosanitize = require("express-mongo-sanitize"); // Express 4.x middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection.

const bodyParser = require("body-parser"); //  Node.js body parsing middleware. Parse incoming request bodies in a middleware before your handlers.

const xss = require("xss"); // Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist

const cors = require("cors"); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

const app = express();

// app.use(xss());

app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 3000,
  windowMs: 60 * 60 * 1000, // In one hour
  message: "Too many requests from this IP, please try again in an hour",
});

app.use("/tawk", limiter);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(mongosanitize());

app.use(routes);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "PATCH", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

module.exports = app;
