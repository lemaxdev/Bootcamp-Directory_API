const Express = require("express");
const App = Express();
const Colors = require("colors");

const ENV = require("./config/env.config");
const ConnectDB = require("./config/db.config");
const Logger = require("morgan");
const errorHandler = require('./middleware/errors');
const BootcampsRouter = require("./routes/bootcamps");

// Middleware for logging on requests, only for DEV
if (ENV.NODE_ENV === "development") {
    App.use(Logger("dev"));
}

// Built-in middleware for body parsing JSON Content-Type
App.use(Express.json());

// Mount router for <bootcamps> data
App.use("/api/v1/bootcamps", BootcampsRouter);

// Middleware for handling errors
App.use(errorHandler);

const Server = App.listen(ENV.PORT, async () => {
    await ConnectDB(); // Try to connect to the database
    // Launch the server
    console.log(`API Server is up and running!`.cyan.inverse);
    console.log(`MODE: ${ENV.NODE_ENV} | PORT: ${ENV.PORT}\n====================`.green);
});

// Handle promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Can't launch the server due to unexpected ERROR:`.magenta +`\n ${err}`.white); 
    Server.close(() => process.exit(1));
});
