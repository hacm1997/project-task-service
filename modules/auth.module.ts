import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user.module';
import { AuthService } from 'src/Models/Auth/service/auth.service';
import { JwtStrategy } from 'src/Models/Auth/utils/jwt.strategy';
import { AuthController } from 'src/Models/Auth/controller/auth.controller';
import { JwtAuthGuard } from 'src/Models/Auth/utils/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.ENV_EXEC_CONF === 'development'
          ? './src/envs/envirotments/development.env'
          : './src/envs/envirotments/production.env',
    }),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.APP_JWT_SECRET_KEY, // JWT secret key
      signOptions: { expiresIn: '1h' }, // expiration time option
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
