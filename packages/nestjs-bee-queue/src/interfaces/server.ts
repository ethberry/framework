import { Type } from "@nestjs/common";
import { ClientProxy, Deserializer, Serializer } from "@nestjs/microservices";
// import { QueueSettings } from "bee-queue";

export interface IBeeServerOptions {
  customClass: Type<ClientProxy>;
  options: {
    queueName: string;
    // queueOptions: QueueSettings;
    url: string;
    serializer?: Serializer;
    deserializer?: Deserializer;
  };
}
