const { Router } = require('express');
const routes = new Router();

const UserController = require('../app/controllers/UserController');
const SessionController = require('../app/controllers/SessionController');

const authMiddleware = require('../app/middlewares/auth');
const User = require('../app/models/User');

routes.get('/user', UserController.show);
routes.post('/user', UserController.store);
routes.put('/user', authMiddleware, UserController.update);
routes.delete('/user', authMiddleware, UserController.delete);

routes.post('/session', SessionController.store); 
module.exports = routes;