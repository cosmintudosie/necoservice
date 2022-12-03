const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fileUpload = require("express-fileupload");
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
const port = process.env.PORT || 5000;
dotenv.config({ path: "./config.env" });

const CLIENT_ID = process.env.CLIENT_ID;

const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// const url = process.env.DATABASE;
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
////MAIL
app.post("/formPost", (req, res) => {
  const order = req.body;

  let image = req.files.image;
  let uploadPath = "images/" + image.name;
  console.log(uploadPath);
  image.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    async function sendMail() {
      try {
        const accesToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: "necocomenzi@gmail.com",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accesToken: accesToken,
          },
        });
        const mailOptions = {
          from: "comanda piese <necocomenzi@gmail>",
          to: "cocopolice@yahoo.com",
          subject: `Comanda de la ${order.name}`,
          text: "Email sent by application",
          html: `<div>
        <h1>Comanda de la ${order.name}</h1>
        <p>Mail/telefon: ${order.mail || "fara date"}</p>
        <p>Marca/modelul: ${order.model || "fara date"}</p>
        <p>Seria: ${order.serial || "fara date"}</p>
        <p>Detalii: ${order.conversation || "fara date"}</p>
        </div>`,
          attachments: [
            {
              path: uploadPath,
            },
          ],
        };
        const result = await transport.sendMail(mailOptions);
        return result;
      } catch (error) {
        return error;
      }
    }
    sendMail()
      .then(() => console.log("Mail sent succesfully"))
      .then(() =>
        fs.unlink(uploadPath, function (err) {
          if (err) {
            return res.end(err);
          } else {
            console.log("deleted");
            return res.redirect("/confirm.html");
          }
        })
      )
      .catch((error) => console.log(error.message));
  });
});

app.listen(port, () => console.log("Listening on port 5000"));
