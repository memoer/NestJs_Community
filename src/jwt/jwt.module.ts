import { Module } from '@nestjs/common';
import { MyConfigModule } from '~/_config/config.module';
import { JwtService } from './jwt.service';

@Module({
  imports: [MyConfigModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
