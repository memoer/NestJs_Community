import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MyConfigModule } from './@config/config.module';
import { PrismaModule } from './@database/database.module';
import { MyGraphQLModule } from './@graphql/graphql.module';
import { SharedModule } from './@shared/shared.module';
import { AuthModule } from './@auth/auth.module';
import { JwtModule } from './@jwt/jwt.module';
import { JwtMiddleware } from './@jwt/jwt.middleware';
import { PubsubModule } from './@pubsub/pubsub.module';
import { HealthController } from './health/health.controller';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './#message/message.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    //! essential
    MyGraphQLModule, // for graphql
    TerminusModule, // for healthcheck
    PubsubModule, // for subscription
    JwtModule, // for jwt
    //! global
    AuthModule, // for auth ( authentication, authorizaiont guard )
    MyConfigModule, // for app env
    PrismaModule, // for database
    SharedModule, // for other resolver
    //* util module
    MessageModule,
    //* module with grapqhl query ( with resolver )
    CommentModule,
    LikeModule,
    PostModule,
    UserModule,
    NotificationModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: 'graphql',
      method: RequestMethod.POST,
    });
  }
}
