import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [UsersModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),

  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get('MONGO_URI'),
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    }),
    inject: [ConfigService]
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
  }),

  AuthModule,

  PostsModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
