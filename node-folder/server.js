const express = require('express')
const bodyParser = require('body-parser')
const Pusher = require('pusher')
const uuid = require('uuid').v4
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
})

app.get('/', (req, res) => {
  res.send({ success: true, message: 'server is online' })
})

app.post('/check-in', (req, res) => {
  let { lat, lng, name, userId } = req.body

  if (lat && lng && name) {
    if (userId.length === 0) {
      userId = uuid()
    }

    const location = { lat, lng, name, userId }
    pusher.trigger('location', 'checkin', { location })
    res.send({ success: true, userId })
  } else {
    res.status(400).send({ success: false, message: 'text not broadcasted' })
  }
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
