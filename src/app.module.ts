import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'modules/user.module';
import { AuthModule } from 'modules/auth.module';
import { JwtStrategy } from './Models/Auth/utils/jwt.strategy';
import { CookieToHeaderMiddleware } from './Models/Auth/utils/cookie-to-header.middleware';
import { ProjectModule } from 'modules/project.module';
// import { loadEnvPath } from './envs/env.helper';

// const envFilePath: string = loadEnvPath(`${__dirname}/envs/envirotments`);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.ENV_EXEC_CONF === 'development'
          ? './src/envs/envirotments/development.env'
          : './src/envs/envirotments/production.env',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/projects-taks'),
    UserModule,
    AuthModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieToHeaderMiddleware).forRoutes('*');
  }
}
