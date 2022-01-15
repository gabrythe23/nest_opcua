import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {OpcUaSubscriber} from "./trasporter/opcua.transporter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

// Then combine it with your microservice
    const microservice = app.connectMicroservice({
        strategy: new OpcUaSubscriber(),
    });

    await app.startAllMicroservices();
    await app.listen(3000);
}

bootstrap();
