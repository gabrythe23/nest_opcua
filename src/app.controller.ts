import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {AppGateway} from "./app.gateway";

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly socketGateway: AppGateway,
  ) {}

  @MessagePattern("ns=3;i=1004")
  async readOPCData(@Payload('value') value: number) {
    const node : string = "ns=3;i=1004";
    await this.appService.saveData(value, node);
    this.socketGateway.handleMessage({name:node, text:value})
  }
}
