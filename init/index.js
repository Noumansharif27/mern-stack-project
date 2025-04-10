const mongoose = require("mongoose");
const Course = require("../models/course.js");
const initData = require("./data.js");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(`error - ${err}`);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/futureAcademy");
}

async function initDB() {
  await Course.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    author: "67f6982b712411a6b8c6091d",
  }));
  await Course.insertMany(initData.data);
  console.log("data was initilize.");
}

initDB();
