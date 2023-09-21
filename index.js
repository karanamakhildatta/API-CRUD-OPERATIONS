require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = express.Router();
require("./db/db")();

const morgan = require("morgan");
const handleErrors = require("./middlewears/error-handler.js");
const { Crud } = require("./models/crud-data");
const Joi = require("joi");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

function validateCrud(crud) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
  });
  result = schema.validate(crud);
  return result;
}

app.listen(process.env.PORT || 9999, () => {
  console.log(`app running on port ${process.env.PORT}`);
});

app.use(morgan("dev"));
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Success" });
});
app.use("/api", apiRouter);
apiRouter.get("", (req, res) => {
  res.json({ message: "api is working......" });
});

apiRouter.post("/add-data", async (req, res, next) => {
  const validation = await validateCrud(req.body);
  console.log(req.body);
  const crudData = validation.value;
  if (!validation.error) {
    const crud = new Crud(crudData);
    const result = await crud.save();
    return res.json(result);
  }
  res.status(400);
  const error = new Error(result.error.details[0].message);
  return next(error);
});

apiRouter.get("/add-data/all", async (req, res) => {
  const crud = await Crud.find();
  res.status(200);
  res.json(crud);
});

apiRouter.put("/add-data/:id", async (req, res, next) => {
  user_id = req.params.id;
  let crud = await Crud.findById(user_id);
  const validation = await validateCrud(req.body);
  if (!validation.error) {
    user = Object.assign(crud, req.body);
    crud.save();
    res.status(200);
    return res.json(crud);
  }
  res.status(400);
  const error = new Error(result.error.details[0].message);
  return next(error);
});

apiRouter.delete("/add-data/:id", async (req, res, next) => {
  const user_id = req.params.id;
  try {
    const crud = await Crud.findById(user_id);
    if (!crud) {
      res.status(400);
      let error = new Error("No User Found");
      return next(error);
    }
    await crud.remove();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400);
    error = new Error("Some thing went wrong");
    return next(error);
  }
});
app.use(handleErrors);
