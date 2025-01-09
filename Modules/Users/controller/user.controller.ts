import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserModelDto, UserPreferencesDto } from '../util/user.modelDto';
import { User, UserDocument } from 'src/common/mongodb/schemas/user.shcema';
import { JwtAuthGuard } from 'Modules/Auth/utils/jwt-auth.guard';
import { ROLE_1 } from 'src/common/constants/const';
import { UserToClient } from '../util/user.types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createUser(@Body() userDto: UserModelDto): Promise<User> {
    return this.userService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async getUserById(
    @Param('id') id: string,
  ): Promise<UserDocument | null> {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  public async getUsers(
    @Request() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name?: string,
    @Query('role') role?: string,
    @Query('email') email?: string,
    @Query('minReputation') minReputation?: number,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const user: UserToClient = req.user;
    if (user.role === ROLE_1) {
      return this.userService.findAll(page, limit, {
        name,
        role,
        email,
        minReputation,
      });
    } else {
      return { data: [], total: null, page: null, totalPages: null };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id/password')
  updatePassword(
    @Param('id') id: string,
    @Body() data: { currentPassword: string; newPassword: string },
  ): Promise<{ message: string; status: HttpStatus }> {
    return this.userService.updatePassword(
      id,
      data.currentPassword,
      data.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('preferences')
  public async getInfoUser(
    @Body('email') email: string,
  ): Promise<UserPreferencesDto> {
    return this.userService.getUserPreferences(email);
  }
}
