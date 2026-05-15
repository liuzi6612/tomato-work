import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'https://github.com/liuzi6612/tomato-work'
  }
}
