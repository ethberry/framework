import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Log } from "ethers";

import { companyName } from "@framework/constants";
import { NodeEnv } from "@framework/types";

import { AppModule } from "./app.module";

export interface IRedisJob {
  id: string;
  data: {
    route: string;
    decoded: any;
    context: Log;
  };
}

let app: NestExpressApplication;

async function bootstrap(): Promise<void> {
  app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<NodeEnv>("NODE_ENV", NodeEnv.development);
  const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672");
  const rmqQueueEth = configService.get<string>("RMQ_QUEUE_CORE_ETH", "core_eth");

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueueEth,
    },
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.set("trust proxy", true);

  if (nodeEnv === NodeEnv.production || nodeEnv === NodeEnv.staging) {
    app.enableShutdownHooks();
  }

  const options = new DocumentBuilder()
    .setTitle(companyName)
    .setDescription("API description")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  /*
  // Process jobs from as many servers or processes as you like
  const redisQueueName = configService.get<string>("REDIS_QUEUE_NAME", "ETH_EVENTS");
  const sharedConfigWorker = {
    redis: {
      url: configService.get<string>("REDIS_WS_URL", "redis://localhost:6379/"),
    },
    storeJobs: false,
    sendEvents: false,
    getEvents: false,
  };

  const discoveryService: DiscoveryService = app.get<DiscoveryService>(DiscoveryService);
  const getQueue = new Queue(redisQueueName, sharedConfigWorker);

  getQueue.process(async (job: IRedisJob, _done: any): Promise<Observable<any>> => {
    console.info(`PROCESSING JOB ${job.id}, route: ${job.data.route}`);

    const discoveredMethodsWithMeta = await getHandlerByPattern(job.data.route, discoveryService);
    if (!discoveredMethodsWithMeta.length) {
      console.info(`Handler not found for: ${job.data.route}`);
      return Promise.reject(EMPTY);
    }

    return await Promise.allSettled(
      discoveredMethodsWithMeta.map(discoveredMethodWithMeta => {
        return (
          discoveredMethodWithMeta.discoveredMethod.handler.bind(
            discoveredMethodWithMeta.discoveredMethod.parentClass.instance,
          ) as MessageHandler
        )(job.data.decoded, job.data.context);
      }),
    ).then(res => {
      res.forEach(r => {
        if (r.status === "rejected") {
          console.error(r);
        }
      });
      return from(["OK"]);
    });
  });
   */

  await app
    .startAllMicroservices()
    .then(() => console.info(`Core-Eth service is subscribed to ${rmqUrl}/${rmqQueueEth}`));

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<number>("PORT", 3021);

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  await app.listen(port, host, () => {
    console.info(`API server is running on http://${host}:${port}`);
  });
}

void bootstrap();
