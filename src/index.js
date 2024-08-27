import dotenv from 'dotenv';
import connectDB from './db';
import {app} from './app'

dotenv.config({path: './.env'})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server started at PORT: ${process.env.PORT}`)
    })
})
.catch(err => console.log(`Error in connecting to DB !!! ${err}`))