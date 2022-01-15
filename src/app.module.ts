import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { AppService } from './app.service';
import {Data, DataSchema} from "./schemas/data.schema";
import {AppController} from "./app.controller";
import { AppGateway } from './app.gateway';

@Module({
    imports: [
        MongooseModule.forRoot(
            process.env.MONGODB_URI,
            {
                useUnifiedTopology: true
            }
        ),
        MongooseModule.forFeature([
            {name: Data.name, schema: DataSchema},
        ]),
    ],
  controllers: [AppController],
  providers: [
      AppGateway,
      AppService,
  ],
})
export class AppModule {}
