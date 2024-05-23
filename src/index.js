import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import router from './routes/router.js';
import connectDB from './config/mongo.js';

dotenv.config();

const app = express();
connectDB();
app.set('view engine', 'pug');
app.set('src/views',  'views');

app.use(express.static('src/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use('/', router);

app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${process.env.PORT}`);
});