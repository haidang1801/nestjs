import { BadRequestException, Injectable, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dtos/registerUser.dto';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async register(requestBody: RegisterUserDto) {
    //check email is exist
    const userByEmail = await this.userService.findByEmail(requestBody.email);
    if (userByEmail) {
      throw new BadRequestException('Email already exist');
    }
    //hash password
    const hashPassword = await bcrypt.hash(requestBody.password, 10);
    requestBody.password = hashPassword;
    //save to db
    const saveUser = await this.userService.create(requestBody);
    //generate jwt token
    const payload = {
      id: saveUser.id,
      firstName: saveUser.firstName,
      lastName: saveUser.lastName,
      role: saveUser.role,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET, //Note:
    });
    return {
      message: 'user has been created!',
      access_token,
    };
  }

  async login(requestBody: LoginUserDto) {
    //check email is exist
    const userLogin = await this.userService.findByEmail(requestBody.email);
    if (!userLogin) {
      throw new BadRequestException('Email is invalid');
    }
    //check password is exist
    const checkPassword = await bcrypt.compare(
      requestBody.password,
      userLogin.password,
    );
    if (!checkPassword) {
      throw new BadRequestException('Password is invalid!');
    }
    // generate jwt token
    const payload = {
      id: userLogin.id,
      firstName: userLogin.firstName,
      lastName: userLogin.lastName,
      email: userLogin.email,
      password: userLogin.password,
      role: userLogin.role,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '120s' ,
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: '1h',
    })
    // await this.userService.setCurrentRefreshToken(refresh_token, userLogin.id);
    return {
      message: 'user has been login successfully',
      access_token,
      refresh_token
    };
  }

  getCurrent(@Request() req) {
    return req.currentUser;
  }
}
