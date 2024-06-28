import express from 'express'
import bodyParser from 'body-parser'
import router from './routes'

const app = express()
const port = 8000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', router)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
