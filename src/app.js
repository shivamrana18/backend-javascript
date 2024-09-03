import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use( cors( { origin: process.env.CORS_ORIGIN, credentials: true, methods: [ 'GET', 'POST', 'DELETE', 'PUT' ] } ) )
app.use( express.json( { limit: '50kb' } ) )
app.use( express.urlencoded( { extended: true, limit: '50kb' } ) )
app.use( express.static( 'public' ) )
app.use( cookieParser() )

// routes import
import userRouter from './routes/user.router.js'

// route declaration
app.use( '/', ( req, res ) => {
    res.send( 'Welcome to the backend API!' )
} )
app.use( '/users', userRouter )

export { app }