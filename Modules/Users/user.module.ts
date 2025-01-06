import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/mongodb/schemas/user.shcema';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserRepository } from './data/user.repository';
import { JwtStrategy } from 'Modules/Auth/utils/jwt.strategy';
import { JwtAuthGuard } from 'Modules/Auth/utils/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtStrategy, JwtAuthGuard],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
