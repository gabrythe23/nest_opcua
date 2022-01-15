import {CustomTransportStrategy, RpcException, Server} from "@nestjs/microservices";
import {
    AttributeIds,
    ClientMonitoredItem,
    ClientSession,
    ClientSubscription,
    DataValue,
    MessageSecurityMode,
    MonitoringParametersOptions,
    OPCUAClient,
    SecurityPolicy,
    TimestampsToReturn
} from "node-opcua";

export class OpcUaSubscriber extends Server implements CustomTransportStrategy {
    subscription: ClientSubscription;
    session: ClientSession;
    client: OPCUAClient = OPCUAClient.create({
        applicationName: process.env.OPCUA_APP_NAME,
        connectionStrategy: {
            initialDelay: 1000,
            maxRetry: 1
        },
        securityMode: MessageSecurityMode.None,
        securityPolicy: SecurityPolicy.None,
        endpointMustExist: false
    });
    endpointUrl: string = process.env.OPCUA_ENDPOINT

    /**
     * This method is triggered when you run "app.listen()".
     */
    async listen(callback: () => void) {
        try {
            // create opc client
            await this.client.connect(this.endpointUrl);
            // create session
            this.session = await this.client.createSession();
            // create subscription
            this.subscription = ClientSubscription.create(this.session, {
                requestedPublishingInterval: 1000,
                requestedLifetimeCount: 100,
                requestedMaxKeepAliveCount: 10,
                maxNotificationsPerPublish: 100,
                publishingEnabled: true,
                priority: 10
            });

            this.subscription
                .on("started", () => console.log("started"))
                .on("keepalive", () => console.log("keepalive"))
                .on("terminated", () => console.log("terminated"));

            this._loadSubscriptions();
        } catch (err) {
            if (err instanceof Error) {
                throw new RpcException(`An error has occurred : ${err.message}`)
            }
        }
        callback();
    }

    /**
     * load subscription from decorators
     * @private
     */
    private _loadSubscriptions() {
        const keys : IterableIterator<string>= this.messageHandlers.keys();

        for (const key of keys) {
            this._loadSingleSubscription(key);
        }
    }

    _loadSingleSubscription(nodeId) {
        const itemToMonitor = {
            nodeId,
            attributeId: AttributeIds.Value
        };
        const parameters: MonitoringParametersOptions = {
            samplingInterval: 100,
            discardOldest: true,
            queueSize: 10
        };

        const monitoredItem : ClientMonitoredItem = ClientMonitoredItem.create(
            this.subscription,
            itemToMonitor,
            parameters,
            TimestampsToReturn.Both
        );

        monitoredItem.on(
            "changed",
            (dataValue: DataValue) => {
                this.messageHandlers.get(nodeId)(dataValue.value)
            }
        );
    }

    /**
     * This method is triggered on application shutdown.
     */
    async close() {
        await this.subscription.terminate();
        // close session
        await this.session.close();
        // disconnecting
        await this.client.disconnect();
    }
}
