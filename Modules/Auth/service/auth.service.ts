import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'Modules/Users/service/user.service';
import { UserModelDto } from 'Modules/Users/util/user.modelDto';
import { LoginResponse } from 'src/common/interfaces/login-response.interface';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<UserModelDto, 'password'> | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const result = { ...user.toObject(), password: undefined };
      delete result.password;
      return result;
    }
    return null;
  }

  async login(user: UserModelDto): Promise<LoginResponse> {
    const validUser = await this.validateUser(user.email, user.password);

    if (!validUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Generate JWT token
    const payload = {
      email: validUser.email,
      name: validUser.name,
      role: validUser.role,
      details: validUser.details ?? {},
      reputationPoints: validUser.reputationPoints,
      username: validUser.user_name,
      id: validUser._id.toString(),
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
