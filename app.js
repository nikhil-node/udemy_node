const express = require("express");
const morgan = require("morgan");
//  Middleware
const app = express();
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

app.use(express.json());
// Morgan middleware

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}
//Middleware
app.use((req, res, next) => {
  res.duration = new Date().toISOString();
  next();
});
//Static file access
app.use(express.static(`${__dirname}/public`));

//Routes
// app.get('/api/v1/tour',getAllTour);
// app.get('/api/v1/tour/:id',getTour);
// app.post('/api/v1/tour',createTour);
// app.patch('/api/v1/tour/:id',updateTour);

// app.route('/api/v1/tour').get(getAllTour).post(createTour);
// app.route('/api/v1/tour/:id').get(getTour).patch(updateTour);

// app.route('/api/v1/user').get(getAllUser).post(createUser);

app.use("/api/v1/tour", tourRouter); // mounting router example step-3
app.use("/api/v1/user", userRouter);

//route error handler
app.all("*", (req, res, next) => {
  /** Example 1 */
  // res.status(404).json({
  //   status: "fail",
  //   message: `can't find requestd ${req.originalUrl}`,
  // });

  /** Example 2 */
  // const err = new Error(`can't find requestd url:  ${req.originalUrl}`);
  // err.statusCode = 404;
  // err.status = "Failed";
  // next(err);

  /** Example 3 */
  next(new AppError(`can't find requestd url:  ${req.originalUrl}`));
});
// Global error handler middleware -Example - 1
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });
// Global error handler middleware -Example - 2
app.use(globalErrorHandler);
module.exports = app;
