import { User } from '../entity/user';
import * as jwt from 'jsonwebtoken';
import { IUserToken } from './token';
import { ExtractJwt, VerifiedCallback, Strategy } from 'passport-jwt';
import { getDatasource } from '../database';
import * as Express from 'express';
import * as Passport from 'passport';
import { StrategyCreatedStatic } from 'passport';
import { plainToInstance } from 'class-transformer';
import { LoginRequest } from '../requests/loginRequest';
import { validate } from 'class-validator';
import { UserService } from '../services/userService';
const passport = require('passport');
const bcrypt = require('bcrypt');

// TODO: Move this into an envar
const JWT_SECRET = 'yxxB73KT39q8';

export function getJWTTokenForUser(user: User) {
  const body = { id: user.uniqueId };
  // 60 * 1440 is 1 day of validity (1440 minutes in a day)
  const token = jwt.sign(body, JWT_SECRET, {
    expiresIn: 60 * 1440,
  });
  return token;
}

class LoginRequestPassportStrategy
  implements Passport.Strategy, StrategyCreatedStatic
{
  // @ts-ignore
  public error: (err: any) => void;

  // @ts-ignore
  public fail: (challenge?: string | number, status?: number) => void;

  // @ts-ignore
  public pass: () => void;

  // @ts-ignore
  public redirect: (url: string, status?: number) => void;

  // @ts-ignore
  public success: (user: Express.User, info?: object) => void;

  name = 'uniqueIdStrategy';

  async authenticate(req: Express.Request, options?: any): Promise<any> {
    // TODO: We shouldn't need this "as any" but I can't see what's going on here
    const loginRequest = plainToInstance(
      LoginRequest,
      req.body
    ) as LoginRequest;
    const errors = await validate(loginRequest);

    if (errors.length) {
      return this.fail();
    }

    const user = await UserService.getUserByEmail(loginRequest.email);

    if (!user) {
      return this.fail();
    } else {
      const isPasswordMatch = await UserService.isUserPassword(
        user,
        loginRequest.password
      );

      if (!isPasswordMatch) {
        return this.fail();
      }

      const savedUser = await UserService.updateUserForLogin(user);
      return this.success(savedUser);
    }
  }
}

export function configurePassport() {
  passport.use('login', new LoginRequestPassportStrategy());

  // TODO: The types on the callback from @types/passport aren't matching up
  const handleAuth: any = async (
    req: Request,
    token: IUserToken,
    done: VerifiedCallback
  ) => {
    return await UserService.handleUserAuthentication(token, done);
  };

  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
        passReqToCallback: true,
      },
      handleAuth
    )
  );
}
