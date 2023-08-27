import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { companyName, ns } from "@framework/constants";

import { AppModule } from "./app.module";
import Queue from "bee-queue";

// import { RedisIoAdapter } from "./common/redis/redis";

let app: NestExpressApplication;

async function bootstrap(): Promise<void> {
  app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

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

  const nodeEnv = configService.get<string>("NODE_ENV", "development");

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

  // producer queues running on the web server
  // const sharedConfigSend = {
  //   getEvents: false,
  //   isWorker: false,
  //   redis: {
  //     url: configService.get<string>("REDIS_WS_URL", "redis://localhost:6379/"),
  //   },
  // };
  //
  // const sendQueue = new Queue("ETH_EVENTS", sharedConfigSend);
  // await sendQueue.saveAll([sendQueue.createJob({ x: 3, y: 4 }), sendQueue.createJob({ x: 4, y: 5 })]).then(errors => {
  //   // The errors value is a Map associating Jobs with Errors. This will often be an empty Map.
  //   console.error("errors", errors);
  // });

  const sharedConfigWorker = {
    redis: {
      url: configService.get<string>("REDIS_WS_URL", "redis://localhost:6379/"),
    },
  };

  // Process jobs from as many servers or processes as you like
  const getQueue = new Queue("ETH_EVENTS", sharedConfigWorker);
  getQueue.process(job => {
    console.log(`PROCESSING JOB ${job.id}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return console.log("JOB RESULT", job.data.x + job.data.y);
  });
  // const sendQueue = new Queue("send", {
  //   redis: {
  //     url: configService.get<string>("REDIS_WS_URL", "redis://localhost:6379/"),
  //   },
  //   isWorker: false,
  //   sendEvents: true,
  // });
  // const job = sendQueue.createJob({ x: 2, y: 3 });
  //
  // await job
  //   .timeout(3000)
  //   .retries(2)
  //   .save()
  //   .then((job: any) => {
  //     console.log("JOB CREATED", job.id);
  //     // job enqueued, job.id populated
  //   });
  //
  // await sendQueue.saveAll([sendQueue.createJob({ x: 3, y: 4 }), sendQueue.createJob({ x: 4, y: 5 })]).then(errors => {
  //   console.error("errors", errors);
  //   // The errors value is a Map associating Jobs with Errors. This will often be an empty Map.
  // });

  // Process jobs from as many servers or processes as you like
  // sendQueue.process(function (job: any, done: any) {
  //   console.log(`Processing job ${job.id}`);
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //   return done(null, job.data.x + job.data.y);
  // });

  // const getQueue = new Queue("send", {
  //   redis: {
  //     url: configService.get<string>("REDIS_WS_URL", "redis://localhost:6379/"),
  //   },
  //   isWorker: true,
  //   getEvents: true,
  // });
  //
  // getQueue.process(job => {
  //   console.log(`PROCESSING JOB ${job.id}`);
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //   return console.log("JOB RESULT", job.data.x + job.data.y);
  // });

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
