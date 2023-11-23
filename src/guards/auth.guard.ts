import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      //1. Get token from header
      const token = request.headers.authorization.split(' ')[1];
      if (!token) {
        throw new ForbiddenException('Please provide access token!');
      }
      //2. jwtVerify validate token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });
      // console.log(payload)
      //3. find user in db based on jwtVerify
      //check email is exist
      const userLogin = await this.userService.findByEmail(payload.email);
      if (!userLogin) {
        throw new UnauthorizedException(
          'User not belong to token, please try again!',
        );
      }
      //4. Assign user to request object
      request.currentUser = userLogin;
    } catch (error) {
        throw new ForbiddenException('Invalid token or expired');
    }
    return true;
  }
}
