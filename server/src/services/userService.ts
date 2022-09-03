import RegisterUserRequest from '../requests/registerUserRequest';
import { User } from '../entity/user';
import ShortUniqueId from 'short-unique-id';
import { IUserToken } from '../security/token';
import { VerifiedCallback } from 'passport-jwt';
import { getDatasource } from '../database';
const bcrypt = require('bcrypt');

const uid = new ShortUniqueId();

export class UserService {
  static async createUser(request: RegisterUserRequest) {
    let user = new User();
    user.name = request.name;
    user.email = request.email;
    user.isEmailConfirmed = false;
    user.password = await bcrypt.hash(request.password, 10);
    user.uniqueId = uid();

    return user;
  }

  static async handleUserAuthentication(
    token: IUserToken,
    done: VerifiedCallback
  ) {
    const dataSource = await getDatasource();
    const user = await dataSource.manager
      .getRepository(User)
      .findOneBy({ uniqueId: token.id });
    if (user) {
      return done(null, user);
    } else {
      return done(`Invalid JWT: ${JSON.stringify(token)}`);
    }
  }

  static async getUserByEmail(email: string) {
    const dataSource = await getDatasource();
    return await dataSource.manager
      .getRepository(User)
      .findOneBy({ email: email });
  }

  static async updateUserForLogin(user: User) {
    user.lastLogin = new Date();
    const dataSource = await getDatasource();
    await dataSource.manager.save(user);
    return user;
  }

  static async isUserPassword(user: User, password: string) {
    return await bcrypt.compare(password, user.password);
  }
}
