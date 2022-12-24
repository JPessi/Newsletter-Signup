const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mailchimp.setConfig({
  apiKey: "ae2efb25632b38dae3e5e6608bac85be",
  server: "us21",
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const listID = "d45a3ecf57";

  async function addMember() {
    const response = await mailchimp.lists
      .addListMember(listID, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      })
      .then(
        (value) => {
          console.log("Successfully added contact as an audience member.");
          res.sendFile(__dirname + "/success.html");
        },
        (reason) => {
          res.sendFile(__dirname + "/failure.html");
        }
      );
  }
  addMember();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
