import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { RegisterUserDto } from './dtos/registerUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/loginUser.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from './decorators/currentUser.decorator';
import { User } from './users.entity';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get()
  // @UseGuards(AuthGuard)
  // find() {
  //   return this.userService.findAll();
  // }

  @Get('/:id')
  @UseGuards(AuthGuard)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Put('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateUserDto,
  ) {
    return this.userService.updateById(id, requestBody);
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteById(id);
  }

  @Post('/register')
  registerUser(@Body() requestBody: RegisterUserDto) {
    return this.authService.register(requestBody);
  }

  @Post('/login')
  loginUser(@Body() requestBody: LoginUserDto) {
    return this.authService.login(requestBody);
  }

  @Get('/current')
  @UseGuards(AuthGuard)
  async getCurrent(@CurrentUser() currentUser:User) {
    console.log(currentUser)
    return currentUser;
  }

  // @Get('/current-user')
  // @UseGuards(AuthGuard)
  // getCurrent(@Request() req) {
  //   return this.authService.getCurrent(req);
  // }

  @Get()
  @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }
}
