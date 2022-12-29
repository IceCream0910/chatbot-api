const express = require("express");
var request = require("request");
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
const cors = require('cors');
global.document = document;
var $ = jQuery = require('jquery')(window);
const moment = require("moment");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.get("/api", (req, res_api) => {
  const { prompt, sessionId } = req.body;
  var data = {
    "request": {
      "query": prompt
    }
  };
  var options = {
    url: "https://builder.pingpong.us/api/builder/63133aece4b0793ad020a1aa/integration/v0.2/custom/" + sessionId,
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Authorization": "Basic a2V5OjMwNDU2YzQ1OTg0NjQ4N2Y5MzdlODM1YWE3ZjZkYTdm",
      "Content-Type": "application/json"
    },
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      var result = data.response.replies[0].text;
      res_api.send(result);
    }
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

