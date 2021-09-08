import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { ProviderType } from "@gemunion/framework-types";

export const pdfServiceProvider = {
  provide: ProviderType.PDF_SERVICE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ClientProxy => {
    const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    const rmqQueuePdf = configService.get<string>("RMQ_QUEUE_PDF", "pdf");
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: rmqQueuePdf,
      },
    });
  },
};
