import * as Express from 'express';
import { plainToInstance } from 'class-transformer';
const passport = require('passport');
import { validate } from 'class-validator';
import { getDatasource } from './database';
import RegisterUserRequest from './requests/registerUserRequest';
import { User } from './entity/user';
import { configurePassport, getJWTTokenForUser } from './security/passport';
import { UserService } from './services/userService';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const server: Express.Express = express();

const corsOptions = {
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
  origin: '*',
  preflightContinue: false,
};

const corsOpts = cors(corsOptions);
server.use(corsOpts);
server.options('*', corsOpts);
server.set('trust proxy', true);
server.use(bodyParser.json({ limit: '15mb' }));
configurePassport();

server.post(
  '/api/register',
  async (req: Express.Request, res: Express.Response) => {
    const request = plainToInstance(RegisterUserRequest, req.body);
    if (!(await validateAndSendOnError(request, res))) {
      return;
    }

    const user = await UserService.createUser(request);

    const dataSource = await getDatasource();
    await dataSource.manager.getRepository(User).save(user);

    res.send({ token: getJWTTokenForUser(user) });
  }
);

server.get(
  '/api/profile',
  passport.authenticate('jwt', { session: false }),
  async (req: Express.Request, res: Express.Response) => {
    const user = req.user as User;
    const jwtToken = getJWTTokenForUser(user);

    const data = {
      name: user.name,
      uniqueId: user.uniqueId,
      token: jwtToken,
      email: user.email,
    };
    res.send(data);
  }
);

server.post(
  '/api/login',
  passport.authenticate('login', { session: false }),
  async (req: Express.Request, res: Express.Response) => {
    const jwtToken = getJWTTokenForUser(req.user as User);
    const data = { token: jwtToken };

    res.send(data);
  }
);

async function validateAndSendOnError(object: object, res: Express.Response) {
  const errors = await validate(object);

  if (errors.length) {
    const constraints = errors[0].constraints ?? {};
    res.send({
      error: true,
      msg: `There are problems with your request`,
      errors,
    });
    return false;
  }

  return true;
}

const port = (process.env as any).PORT || 8080;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on ${port}`);
});
