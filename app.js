const express = require("express");

const morgan = require("morgan");  //  is a popular middleware for logging HTTP requests in Node.js web applications.

const rateLimit = require("express-rate-limit"); //  Use to limit repeated requests to public APIs and/or endpoints such as password reset.

const helmet = require("helmet"); // Helmet helps secure Express apps by setting HTTP response headers.

const app = express();
