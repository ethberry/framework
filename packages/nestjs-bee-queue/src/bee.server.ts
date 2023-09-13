import { Injectable } from "@nestjs/common";
import { CustomTransportStrategy, IncomingRequest, Server } from "@nestjs/microservices";
import { NO_MESSAGE_HANDLER } from "@nestjs/microservices/constants";
import { from } from "rxjs";
import Queue from "bee-queue";

import { IBeeQueueJob, IBeeQueueJobData, IBeeServerOptions } from "./interfaces";

@Injectable()
export class BeeServer extends Server implements CustomTransportStrategy {
  private worker: Queue;
  private producer: Queue;

  constructor(protected readonly options: IBeeServerOptions["options"]) {
    super();

    this.initializeSerializer(options);
    this.initializeDeserializer(options);
  }

  public createProducer(): void {
    const { url, queueName /*, queueOptions */ } = this.options;

    this.producer = new Queue(queueName, {
      isWorker: false, // по умолчанию создаются воркеры
      getEvents: false,
      redis: {
        url,
      },
    });

    this.producer.on("error", err => {
      this.logger.error(err.message);
    });
  }

  public createWorker(): void {
    const { url, queueName /*, queueOptions */ } = this.options;

    this.worker = new Queue(queueName, {
      getEvents: false,
      redis: {
        url,
      },
    });

    this.worker.process(async (job: IBeeQueueJob, done: any) => {
      console.info(`PROCESSING JOB ${job.id}, data: ${job.data.route}`);
      await this.handleMessage(job.data);
      // тут бы подождать пока выполнится код
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return done(null, job.id); // done - завершает джобу, но она остается в очереди как выполненная
    });

    this.worker.on("error", err => {
      this.logger.error(err.message);
    });
  }

  public async handleMessage(message: IBeeQueueJobData): Promise<void> {
    const { pattern, data, id } = (await this.deserializer.deserialize(message)) as IncomingRequest;

    const handler = this.getHandlerByPattern(pattern);
    const jobId = `${data.context!.transactionHash}_${data.context!.logIndex}`;

    // response if error
    if (!handler) {
      const serializedPacket = this.serializer.serialize({
        id: data.id,
        status: "error",
        err: NO_MESSAGE_HANDLER,
      });
      const job = this.producer.createJob(serializedPacket);
      return job
        .setId(jobId) // можно опустить, тогда само присвоит уникальный id
        .timeout(3000)
        .retries(2)
        .save() // вот тут джоба отправляется в редис
        .then((job: any) => {
          if (!job.id) {
            console.error("JOB NOT CREATED", jobId);
            return;
          }
          console.info("JOB CREATED", job.id);
        });
    }

    const response$ = this.transformToObservable(await handler(data));
    this.send(response$, paket => {
      const serializedPacket = this.serializer.serialize({
        id,
        ...paket,
      });
      const job = this.producer.createJob(serializedPacket);
      return from(
        job
          .setId(id) // можно опустить, тогда само присвоит уникальный id
          .timeout(3000)
          .retries(2)
          .save() // вот тут джоба отправляется в редис
          .then((job: any) => {
            console.info("JOB CREATED", job.id);
          }),
      );
    });
  }

  public listen(callback: () => void): void {
    this.createWorker();
    callback();
  }

  public close(): void {
    void this.worker.close();
  }
}
