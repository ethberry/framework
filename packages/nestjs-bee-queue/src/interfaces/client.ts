import { Type } from "@nestjs/common";
import { ClientProxy, Deserializer, Serializer } from "@nestjs/microservices";
// import { QueueSettings } from "bee-queue";

export interface IBeeClientOptions {
  customClass: Type<ClientProxy>;
  options: {
    queueName: string;
    // queueOptions: QueueSettings;
    url: string;
    serializer?: Serializer;
    deserializer?: Deserializer;
  };
}
