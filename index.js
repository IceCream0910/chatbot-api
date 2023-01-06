const express = require("express");
var request = require("request");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const cohere = require('cohere-ai');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const COHERE_REST_API_KEY = process.env.COHERE_REST_API_KEY || '5tbKDl6SODtA3jAcwZfITdIVKTDjSkMlYX6L6hES';

cohere.init(COHERE_REST_API_KEY)

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


// gpt
app.post("/gpt", async (req, res) => {
  const { prompt } = req.body;

  if (prompt) {
    var headers = {
      "accept": "*/*",
      "accept-language": "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7",
      "content-type": "application/json",
      "sec-ch-ua": "\"Whale\";v=\"3\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"108\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "Referer": "https://cowriter.org/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    };

    // get random text from array 
    var uidArr = [
      "google-oauth2|105521716485650040987",
      "google-oauth2|109156928061800348880",
      "google-oauth2|104251763945864453949",
      "google-oauth2|104251763945864453949",
      "auth0|63b842dcc23d7ececc7c7dc7"]
    var uid = uidArr[Math.floor(Math.random() * uidArr.length)];

    var dataString = {
      'prompt': prompt,
      'uid': uid,
      'action': '',
      'creativity': 0.7,
      'apiKey': '04d93dda3d9af7e5dc3b9e7c2137647b'
    }

    var options = {
      url: 'https://gpt3-optimizer.herokuapp.com/complete',
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
app.post("/cohere", async (req, res) => {
  const { prompt, max_tokens, temperature } = req.body;
  const generateResponse = await cohere.generate({
    model: "xlarge",
    prompt: prompt,
    max_tokens: max_tokens || 10,
    temperature: temperature || 1,
  });
  res.send(generateResponse);
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

// kakao kogpt
app.post("/grammer", async (req, res) => {
  const { prompt } = req.body;
  if (prompt) {
    var headers = {
      "accept": "*/*",
      "accept-language": "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7",
      "authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImNlOWI4ODBmODE4MmRkYTU1N2Y3YzcwZTIwZTRlMzcwZTNkMTI3NDciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSWNlIENyZWFtIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FFZEZUcDVBUmJXemk2Sm5aUEdNaTFPTkFWekk0OGVQOE95ZFVGMFBOMG5BU3c9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ3B0LWtqNWdhdjkiLCJhdWQiOiJncHQta2o1Z2F2OSIsImF1dGhfdGltZSI6MTY3MzAxNjgxNywidXNlcl9pZCI6ImlSVWVjY0Vqd2JONks0SmQ2aHIyQWFyQkYxRDMiLCJzdWIiOiJpUlVlY2NFandiTjZLNEpkNmhyMkFhckJGMUQzIiwiaWF0IjoxNjczMDIxNDI4LCJleHAiOjE2NzMwMjUwMjgsImVtYWlsIjoidGFlaW4yMzcwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA1NTIxNzE2NDg1NjUwMDQwOTg3Il0sImVtYWlsIjpbInRhZWluMjM3MEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.m1jjZSJdqsnbbyXLR5AEEr4VAPb447Wrsul3E8hnSjZn3CQNmgCV-rmO8yelaGyINQMm3qz5OJpyq9AR5qUjl1DLfpEUbkOxjkSralIZn2Vs6eAG3lJnn6-1RR8VArfBSp9U99fVprR5wpHbMualx9z46e7-Q8yh6GgDt8C-BSYdc9HVJ5ipsEQPsaLDNE-MI3K2_qBQT4EAWrBLOJ88Zb6teyGYHwVpEXIp8jaxBK9J1q2s9gulnEb2kMxqwl60micIKm31gWV1cutxn8Lw65TwsvWfJ_HSVJHJWo1S5w1Mlja6zwE5W-ydV5o-aFvAjWUxr58cQ2WBnEvyNMHBQg",
      "cache-control": "max-age=0",
      "content-type": "application/json",
      "sec-ch-ua": "\"Whale\";v=\"3\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"108\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site"
    };
    var dataString = { "input": prompt };
    var options = {
      url: 'https://api-jw6xmi4ira-uc.a.run.app/correct',
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

