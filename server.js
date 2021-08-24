require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const Data = require('./dataModel');

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

// to validate user and get their name and email address
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.sendStatus(401);
    
    const validateURL = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
    try {
        const response = await axios.get(validateURL);
        if(response?.data?.email_verified !== 'true') return res.sendStatus(403);
        if(!response.data.email) return res.sendStatus(401);
        req.user = {
            email: response.data.email,
            picture: response.data.picture,
            name: response.data.name
        };
    } catch (error) {  
        return res.sendStatus(401);
    }

    next();
}

app.get('/', authenticateToken, (req, res) => {
    res.send("You're logged in");
});

app.post('/create-api', authenticateToken, async (req, res) => {
    if(!req.body) return res.sendStatus(422);
    const responseData = await Data.create({
        title: req.body.title,
        description: req.body.description,
        data: req.body.data,
        user: {
            name: req.user.name,
            email: req.user.email
        },
    });

    res.send(responseData);
});

app.get('/get-apis-list', authenticateToken, async (req, res) => {
    const page = req.query.page;
    const pageSize = 10;

    const data = await Data.find({
        user: {
            name: req.user.name,
            email: req.user.email
        },
    })
    .sort({ 'createdAt': -1 })
    .skip(page * pageSize)
    .limit(pageSize);
    data.forEach(api => {
        api.createdAt = api.createdAt.toISOString();
    });
    return res.send(data);
});

app.get('/get-api', authenticateToken, async (req, res) => {
    const id = req.headers.id;
    if(id.length !== 24) res.status(400).send("Invalid id parameter");
    
    const isIdExist = await Data.exists({
        _id: id
    });
    if(!isIdExist) res.sendStatus(404);
    
    const isDataAccessibleByUser = await Data.exists({
        user: {
            name: req.user.name,
            email: req.user.email
        },
        _id: id
    });
    if(isIdExist && !isDataAccessibleByUser) res.sendStatus(401);

    const data = await Data.findOne({
        user: {
            name: req.user.name,
            email: req.user.email
        },
        _id: id
    });
    return res.send(data);
});

app.patch('/update-api', authenticateToken, async (req, res) => {
    if(!req.body) return res.sendStatus(422);

    const isIdExist = await Data.exists({
        _id: req.body.id
    });
    if(!isIdExist) res.sendStatus(404);

    const isDataAccessibleByUser = await Data.exists({
        user: {
            name: req.user.name,
            email: req.user.email
        },
        _id: req.body.id
    });
    if(isIdExist && !isDataAccessibleByUser) res.sendStatus(401);

    const data = await Data.findOneAndUpdate({
        user: {
            name: req.user.name,
            email: req.user.email
        },
        _id: req.body.id
    }, {
        title: req.body.title,
        description: req.body.description,
        data: req.body.data,
    });

    res.send(data);
});

app.delete('/delete-api', authenticateToken, async (req, res) => {
    const id = req.headers.id;
    if(!req.body) return res.sendStatus(422);
    if(id.length !== 24) res.status(400).send("Invalid id parameter");

    const isIdExist = await Data.exists({
        _id: id
    });
    if(!isIdExist) res.sendStatus(404);

    const isDataAccessibleByUser = await Data.exists({
        user: {
            name: req.user.name,
            email: req.user.email
        },
        _id: id
    });
    if(isIdExist && !isDataAccessibleByUser) res.sendStatus(401);

    const data = await Data.findByIdAndDelete(id);

    res.send(data);

});

app.get('/v1/get/:id', async (req, res) => {
    const token = req.params.id;
    if(!token) res.status(400).send('token required');

    const response = await Data.findById(token);
    if(!response) res.sendStatus(404);

    res.send(response.data);
});


app.listen(process.env.PORT || 5000);