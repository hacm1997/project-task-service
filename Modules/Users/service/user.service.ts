import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserBase } from './user.base';
import { UserModelDto, UserPreferencesDto } from '../util/user.modelDto';
import { UserRepository } from '../data/user.repository';
import { User, UserDocument } from 'src/common/mongodb/schemas/user.shcema';
import { cryptjsComparePassword } from 'src/utils/bcrypt.service';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  public async createUser(user: UserModelDto): Promise<User> {
    try {
      const newUserCreate = await this.newUserCreate(user);
      //   console.log('user created => ', newUserCreate);
      const createdUser = await this.userRepository.createUser(newUserCreate);
      // console.log('created user => ', createdUser);
      return createdUser;
    } catch (error) {
      console.error('Error creating user => ', error);
      throw new HttpException('Error to create user', HttpStatus.BAD_REQUEST);
    }
  }

  async findById(id: string): Promise<UserDocument | null> {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      console.error('Error finding user by id => ', error);
      throw new NotFoundException('Error to get user');
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      console.error('Error finding user by email => ', error);
      throw new NotFoundException('Error to get user');
    }
  }

  async getUserPreferences(email: string): Promise<UserPreferencesDto> {
    try {
      const preferences = await this.userRepository.findByEmail(email);
      const preferencesData: UserPreferencesDto = {
        id: preferences._id.toString(),
        email: preferences.email,
        name: preferences.name,
        role: preferences.role,
        user_name: preferences.user_name,
        details: preferences.details,
      };
      return preferencesData;
    } catch (error) {
      console.error('Error finding user by email => ', error);
      throw new NotFoundException('Error to get user');
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: {
      name?: string;
      role?: string;
      email?: string;
      minReputation?: number;
    } = {},
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const findUsers = await this.userRepository.findAll(page, limit, filters);

    if (findUsers.data && findUsers.data.length > 0) {
      findUsers.data.forEach((user) => {
        user.password = undefined;
      });
      return findUsers;
    } else {
      return { data: [], total: null, page: null, totalPages: null };
    }
  }

  public async updateUser(
    id: string,
    updateData: Partial<UserModelDto>,
  ): Promise<User | null> {
    try {
      const newUserUpdate = await this.newUserCreate(updateData);
      return await this.userRepository.updateUser(id, newUserUpdate);
    } catch (error) {
      console.error('Error updating user => ', error);
      throw new NotFoundException('User not found');
    }
  }

  public async updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string; status: HttpStatus }> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //  verify the current password
    const isPasswordValid = await cryptjsComparePassword(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    // if current password is valid
    try {
      await this.userRepository.updatePassword(id, newPassword);
      return {
        message: 'Password updated successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Error updating password => ', error);
      throw new HttpException('Cannot update password', HttpStatus.BAD_REQUEST);
    }
  }

  public async newUserCreate(user: UserModelDto): Promise<UserBase> {
    const newUser = new UserBase(
      user.name,
      user.email,
      user.role,
      user.password,
      user.details,
      user.user_name,
      // user.reputationPoints,
    );
    await newUser.encryptPassword();
    return newUser;
  }
}
