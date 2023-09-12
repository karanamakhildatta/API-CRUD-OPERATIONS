const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const crudData = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Crud = mongoose.model("crud", crudData);

module.exports = { Crud };
