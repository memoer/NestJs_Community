import { GqlModuleOptions } from '@nestjs/graphql';
import { ConfigType } from '@nestjs/config';
import { User } from '@prisma/client';
import { join } from 'path';
import { Request } from 'express';
import appConfig from '~/@config/app.config';
import { JWT_HEADER_NAME } from '~/@jwt/jwt.constants';

interface ContextRequest {
  user: User;
}

interface ContextConnection {
  context: Record<typeof JWT_HEADER_NAME, string>;
}

export interface ContextParams {
  req: ContextRequest & Request;
  connection: ContextConnection;
}

export interface ReturnedContext {
  user: User;
  token: string;
}

export default (appOptions: ConfigType<typeof appConfig>): GqlModuleOptions => {
  const { env } = appOptions;
  const isProd = env === 'production';
  const options: GqlModuleOptions = {
    // if true -> in memory
    sortSchema: true,
    playground: !isProd,
    debug: !isProd,
    context: ({ req, connection }: ContextParams) => {
      if (req) {
        // HTTP conection
        return { user: req.user };
      }
      // WS connection
      return { token: connection.context.authorization };
    },
    installSubscriptionHandlers: true,
  };
  if (!isProd) {
    options.autoSchemaFile = join(process.cwd(), 'src/schema.gql');
  } else {
    options.typeDefs = join(__dirname, '..', 'schema.graphql');
  }
  return options;
};
