const express = require("express");
var request = require("request");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const REST_API_KEY = 'a1cb5ad868a6adb4d8d59d2454d4b2bc' || process.env.KAKAO_REST_API_KEY;

app.get("/", (req, res_api) => {
  res_api.send("여기는 선길이의 머릿속입니다");
});

// pingpong chat
app.post("/api", (req, res_api) => {
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

// kakao kogpt
app.post("/koGPT", async (req, res) => {
  const { prompt, max_tokens, temperature, top_p, n } = req.body;
  console.log(req.body);
  if (prompt) {
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': `KakaoAK ${REST_API_KEY}`
    };

    var dataString = {
      "prompt": prompt,
      "max_tokens": max_tokens || 10,
      "temperature": temperature || 1,
      "top_p": top_p || 1,
      "n": n || 1
    };

    var options = {
      url: 'https://api.kakaobrain.com/v1/inference/kogpt/generation',
      headers: headers,
      body: JSON.stringify(dataString)
    };

    request.post(options, function (error, response, body) {
      console.log('responseCode = ' + response.statusCode);
      res.send(body);
    });
  } else {
    res.json({ error: '프롬프트를 입력해주세요.' });
  }
});

// kakao karlo
app.post("/karlo", async (req, res) => {
  const { prompt } = req.body;
  if (prompt) {
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': `KakaoAK ${REST_API_KEY}`
    };

    var dataString = {
      "prompt": {
        "text": prompt,
        "batch_size": 1
      }
    };

    var options = {
      url: 'https://api.kakaobrain.com/v1/inference/karlo/t2i',
      headers: headers,
      body: JSON.stringify(dataString)
    };

    request.post(options, function (error, response, body) {
      console.log('responseCode = ' + response.statusCode);
      res.send(body);
    });
  } else {
    res.json({ error: '프롬프트를 입력해주세요.' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

