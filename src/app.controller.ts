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

  @MessagePattern(process.env.OPCUA_NODE)
  async readOPCData(@Payload('value') value: number) {
    const node : string = process.env.OPCUA_NODE;
    await this.appService.saveData(value, node);
    this.socketGateway.handleMessage({name:node, text:value})
  }
}
