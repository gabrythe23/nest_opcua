import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { AppService } from './app.service';
import {Data, DataSchema} from "./schemas/data.schema";

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
  providers: [AppService],
})
export class AppModule {}
