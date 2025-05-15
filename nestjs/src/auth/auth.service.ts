import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!user) { // ถ้าไม่พบ user
      return {
        code: 404,
        message: 'User not found',
        data: null,
      };
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password); // ถ้ารหัสผ่านไม่ตรง
    if (!isPasswordValid) {
      return {
        code: 401,
        message: 'Incorrect password',
        data: null,
      };
    }

    const { password, ...result } = user; // ถ้าผ่านการเช็ค ทั้ง2 จะไปไปสร้าง JWT
    return {
      code: 200,
      message: 'Login successfull',
      data: result,
    };
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    return access_token;
  }
}
