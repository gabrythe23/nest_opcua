import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {MessagePattern, Payload} from "@nestjs/microservices";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern("ns=3;i=1004")
  async readOPCData(@Payload('value') value: number) {
    await this.appService.saveData(value, "ns=3;i=1004");
  }
}
