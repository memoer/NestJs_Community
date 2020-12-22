import { GraphQLModule } from '@nestjs/graphql';
import appConfig from '~/@config/app.config';
import graphqlFactory from './graphql.factory';

export const MyGraphQLModule = GraphQLModule.forRootAsync({
  useFactory: graphqlFactory,
  inject: [appConfig.KEY],
});
