import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserModelDto } from '../util/user.modelDto';
import { User } from 'src/common/mongodb/schemas/user.shcema';
import { JwtAuthGuard } from 'src/Models/Auth/utils/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createUser(@Body() userDto: UserModelDto): Promise<User> {
    return this.userService.createUser(userDto);
  }

  @Get()
  public async getUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name?: string,
    @Query('role') role?: string,
    @Query('minReputation') minReputation?: number,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.userService.findAll(page, limit, { name, role, minReputation });
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
}