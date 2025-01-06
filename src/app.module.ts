import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'Modules/Users/user.module';
import { AuthModule } from 'Modules/Auth/auth.module';
import { ProjectModule } from 'Modules/Projects/project.module';
import { TaskModule } from 'Modules/Tasks/task.module';
import { JwtStrategy } from 'Modules/Auth/utils/jwt.strategy';
import { CookieToHeaderMiddleware } from 'Modules/Auth/utils/cookie-to-header.middleware';
import { CommentModule } from 'Modules/Comments/comment.module';
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
    TaskModule,
    CommentModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieToHeaderMiddleware).forRoutes('*');
  }
}
