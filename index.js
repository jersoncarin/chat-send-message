const send = require('./send')

// Send for the firs time
(async () => await send())()

// Send for second time and infinity
setInterval(async() => await send(),process.env.TIME_DELAY || 300000)