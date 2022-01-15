require('dotenv').config({ path: `./.env` });
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {OpcUaSubscriber} from "./trasporter/opcua.transporter";
import { join } from 'path';
import {NestExpressApplication} from "@nestjs/platform-express";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule,{ cors: true });
    app.useStaticAssets(join(__dirname, '..', 'static'));
    // Then combine it with your microservice
    const microservice = app.connectMicroservice({
        strategy: new OpcUaSubscriber(),
    });

    await app.startAllMicroservices();
    await app.listen(3000);
}

bootstrap();
