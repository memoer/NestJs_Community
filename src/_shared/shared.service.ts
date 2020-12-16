import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SharedService {
  private readonly _saltOrRounds = 10;
  public success<T>(data: Promise<T>) {
    return { ok: true, data };
  }
  public generateHash(plainString: string): Promise<string> {
    return bcrypt.hash(plainString, this._saltOrRounds);
  }
  public checkHashWithPlain(plainString: string, hash: string): boolean {
    return bcrypt.compareSync(plainString, hash);
  }
}
