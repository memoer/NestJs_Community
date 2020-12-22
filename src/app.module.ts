import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MyConfigModule } from './_config/config.module';
import { PrismaModule } from './_database/database.module';
import { MyGraphQLModule } from './_graphql/graphql.module';
import { SharedModule } from './_shared/shared.module';
import { HealthController } from './_health/health.controller';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { AuthModule } from './_auth/auth.module';
import { JwtModule } from './_jwt/jwt.module';
import { JwtMiddleware } from './_jwt/jwt.middleware';
import { PubsubModule } from './_pubsub/pubsub.module';

@Module({
  imports: [
    //! essential module
    MyGraphQLModule, // for graphql
    TerminusModule, // for healthcheck
    PubsubModule, // for subscription
    JwtModule, // for jwt
    //! global module
    AuthModule, // for auth ( authentication, authorizaiont guard )
    MyConfigModule, // for app env
    PrismaModule, // for database
    SharedModule, // for other resolver
    //* resolver
    CommentModule,
    LikeModule,
    PostModule,
    UserModule,
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
