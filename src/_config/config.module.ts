import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import appConfig, { appSchema } from './app.config';

export const MyConfigModule = ConfigModule.forRoot({
  envFilePath: `.env.${process.env.NODE_ENV}`,
  ignoreEnvFile: process.env.NODE_ENV === 'production',
  load: [appConfig],
  validationSchema: Joi.object({
    ...appSchema,
  }),
  validationOptions: {
    // 환경 변수의 값이 unknown인 변수들을 허용할 것인가?
    allowUnknow: false,
    // true -> 첫 번째 validation 검사에서 멈춤
    // false -> 모두 유효성 검사를 진행하고 모든 error를 출력
    abortEarly: false,
  },
});
