const express = require('express') ;
const app = express();
const port = process.env.PORT || 3001 ;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const account = [
    { 
        id: 1, 
        username: 'ngocthai',
        role: 'admin'
    },
    { 
        id: 2, 
        username: 'ngocthai123',
        role: 'user'
    },
    { 
        id: 3, 
        username: 'ngocthai456',
        role: 'user'
    },
]

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const data = req.body ;
    console.log({data})
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn:'60s' })
    res.send({ accessToken });
})

app.get('/accounts', authenToken, (req, res) => {
    res.send({status: 'success', data: account});
})

function authenToken(req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    const token =  authorizationHeader.split(' ')[1];
    if(!token) res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
        console.log(err, result)
        if (err) res.sendStatus(401);
        next();
    })
}

app.listen(port);
console.log('Server listening on port : ' + port);