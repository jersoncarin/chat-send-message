const send = require('./send')
const express = require('express')

const app = express()
const port = 3000

app.get('/v1/send', async (req, res) => {
    await send()
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 200 }));
})

app.listen(port, () => {
  console.log(`Random quotes app listening at http://localhost:${port}`)
})