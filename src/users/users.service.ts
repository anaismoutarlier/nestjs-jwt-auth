import { Injectable, UnauthorizedException } from '@nestjs/common';
import { users } from './users.mock';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private jwtService: JwtService) {}
  private readonly users = users;
  getUsers(userType: string): User[] {
    if (userType !== 'admin') throw new UnauthorizedException();
    return this.users;
  }

  getUser(username: string) {
    return this.users.find((user) => user.username === username);
  }

  newUser(body: User) {
    this.users.push(body);
    return { result: true, username: this.users.at(-1).username };
  }

  async signinUser(body: { username: string; password: string }) {
    const { username, password } = body;
    const user = this.users.find(
      (user) => user.username === username && user.password === password,
    );
    if (!user) throw new UnauthorizedException();
    const payload = {
      username: user.username,
      type: user.type,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
