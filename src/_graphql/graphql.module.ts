import { GraphQLModule } from '@nestjs/graphql';
import { MyConfigModule } from '~/_config/config.module';
import appConfig from '~/_config/app.config';
import graphqlFactory from './graphql.factory';

export const MyGraphQLModule = GraphQLModule.forRootAsync({
  imports: [MyConfigModule],
  useFactory: graphqlFactory,
  inject: [appConfig.KEY],
});
