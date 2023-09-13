import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport, MessageHandler } from "@nestjs/microservices";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { DiscoveredMethodWithMeta, DiscoveryService } from "@golevelup/nestjs-discovery";
import { PATTERN_METADATA } from "@nestjs/microservices/constants";
import { transformPatternToRoute } from "@nestjs/microservices/utils";
import { EMPTY, from, Observable } from "rxjs";
import Queue from "bee-queue";
import { Log } from "ethers";

import { companyName, ns } from "@framework/constants";

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

async function getHandlerByPattern<T extends Array<Record<string, string>>>(
  route: string,
  discoveryService: DiscoveryService,
): Promise<Array<DiscoveredMethodWithMeta<T>>> {
  const methods = await discoveryService.controllerMethodsWithMetaAtKey<T>(PATTERN_METADATA);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return methods.filter(method => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return method.meta.some(meta => transformPatternToRoute(meta) === route);
  });
}

async function bootstrap(): Promise<void> {
  app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>("NODE_ENV", "development");
  const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672");
  const rmqQueueEthlogger = configService.get<string>("RMQ_QUEUE_CORE_ETH", "core_eth");

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueueEthlogger,
    },
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.set("trust proxy", true);

  if (nodeEnv === "production" || nodeEnv === "staging") {
    app.enableShutdownHooks();
  }

  const options = new DocumentBuilder()
    .addCookieAuth(ns)
    .setTitle(companyName)
    .setDescription("API description")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  // Process jobs from as many servers or processes as you like
  const sharedConfigWorker = {
    redis: {
      url: configService.get<string>("REDIS_WS_URL", "redis://localhost:6379/"),
    },
  };
  const getQueue = new Queue("ETH_EVENTS", sharedConfigWorker);
  getQueue.process(async (job: IRedisJob, done: any): Promise<Observable<any>> => {
    console.info(`PROCESSING JOB ${job.id}, route: ${job.data.route}`);

    const discoveryService: DiscoveryService = app.get<DiscoveryService>(DiscoveryService);
    const discoveredMethodsWithMeta = await getHandlerByPattern(job.data.route, discoveryService);
    if (!discoveredMethodsWithMeta.length) {
      console.info(`Handler not found for: ${job.data.route}`);
      return Promise.resolve(EMPTY);
    }

    await Promise.allSettled(
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return from(["OK"]);
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return done(null, job.id);
  });

  await app
    .startAllMicroservices()
    .then(() => console.info(`Core-Eth service is subscribed to ${rmqUrl}/${rmqQueueEthlogger}`));

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<number>("PORT", 3021);

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  await app.listen(port, host, () => {
    console.info(`API server is running on http://${host}:${port}`);
  });
}

void bootstrap();
