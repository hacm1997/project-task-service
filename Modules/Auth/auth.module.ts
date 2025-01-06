import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../Users/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './utils/jwt.strategy';
import { JwtAuthGuard } from './utils/jwt-auth.guard';

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
      signOptions: { expiresIn: '8h' }, // expiration time option
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
