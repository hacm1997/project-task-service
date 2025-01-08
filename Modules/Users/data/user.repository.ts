import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserBase } from '../service/user.base';
import { UserQuery } from '../util/user.types';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from 'src/common/mongodb/schemas/user.shcema';

export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async createUser(user: UserBase): Promise<User> {
    //   console.log('user created => ', newUserCreate);
    const createdUser = new this.userModel(user);
    // console.log('created user => ', createdUser);
    return createdUser.save();
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  public async findById(_id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id }).exec();
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
    const { name, role, email, minReputation } = filters;

    const query: UserQuery = {};
    if (name) query.name = new RegExp(name, 'i'); // ignora mayúsculas o minísculoas
    if (role) query.role = new RegExp(role, 'i');
    if (email) query.email = new RegExp(email, 'i');
    if (minReputation) query.reputationPoints = { $gte: minReputation };

    const total = await this.userModel.countDocuments(query).exec();

    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const data = await this.userModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    return { data, total, page, totalPages };
  }

  public async updateUser(
    id: string,
    updateData: Partial<UserBase>,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  public async updatePassword(
    id: string,
    newPassword: string,
  ): Promise<User | null> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return this.userModel
      .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
      .exec();
  }
}
