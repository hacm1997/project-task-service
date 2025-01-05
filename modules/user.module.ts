import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/mongodb/schemas/user.shcema';
import { JwtAuthGuard } from 'src/Models/Auth/utils/jwt-auth.guard';
import { JwtStrategy } from 'src/Models/Auth/utils/jwt.strategy';
import { UserController } from 'src/Models/Users/controller/user.controller';
import { UserRepository } from 'src/Models/Users/data/user.repository';
import { UserService } from 'src/Models/Users/service/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtStrategy, JwtAuthGuard],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
