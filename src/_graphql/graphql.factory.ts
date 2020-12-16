import { GqlModuleOptions } from '@nestjs/graphql';
import { ConfigType } from '@nestjs/config';
import { join } from 'path';
import appConfig from '~/_config/app.config';
import { CustomRequest } from '~/jwt/jwt.middleware';
import { User } from '@prisma/client';

export interface MyContext {
  user: User;
}

export default (appOptions: ConfigType<typeof appConfig>): GqlModuleOptions => {
  const { env } = appOptions;
  const isProd = env === 'production';
  const options: GqlModuleOptions = {
    // if true -> in memory
    sortSchema: true,
    playground: !isProd,
    debug: !isProd,
    context: ({ req }: { req: CustomRequest }) => ({ user: req.user }),
  };
  if (!isProd) {
    options.autoSchemaFile = join(process.cwd(), 'src/schema.gql');
  } else {
    options.typeDefs = join(__dirname, '..', 'schema.graphql');
  }
  return options;
};
