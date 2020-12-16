import { Catch, HttpException, Inject } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ConfigType } from '@nestjs/config';
import appConfig from '~/_config/app.config';

// HttpException 일 경우에만 해당 Error을 잡는다.
// throw new Error()에 해당하는 에러는 안잡는다.
// nestJs에서 제공해주는 Exception을 throw하면 잡아짐
@Catch(HttpException)
export class SharedExceptionFilter implements GqlExceptionFilter {
  constructor(@Inject(appConfig.KEY) private readonly _appConfig: ConfigType<typeof appConfig>) {}
  catch(exception: HttpException) {
    if (exception.getStatus() < 500) {
      const code = exception.getStatus();
      const message = exception.message;
      console.log(exception.getResponse());
      if (this._appConfig.env === 'development') console.error(exception);
      return { ok: false, error: `${code}/${message}` };
    }
    // sentry
  }
}
