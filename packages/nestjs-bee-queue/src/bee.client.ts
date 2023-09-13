import { Logger } from "@nestjs/common";
import { ClientProxy, PacketId, ReadPacket, WritePacket } from "@nestjs/microservices";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";

import Queue from "bee-queue";

import { IBeeClientOptions, IBeeQueueJob, IBeeQueueJobData } from "./interfaces";

export class BeeClient extends ClientProxy {
  private worker: Queue;
  private producer: Queue;

  private readonly logger = new Logger("BeeQueueService");

  constructor(protected readonly options: IBeeClientOptions["options"]) {
    super();

    this.initializeSerializer(options);
    this.initializeDeserializer(options);
  }

  public createClient(): void {
    const { url, queueName /*, queueOptions */ } = this.options;

    this.producer = new Queue(queueName, {
      isWorker: false, // по умолчанию создаются воркеры
      getEvents: false,
      redis: {
        url,
      },
    });

    this.worker = new Queue(queueName, {
      getEvents: false,
      redis: {
        url,
      },
    });

    this.worker.process(async (job: IBeeQueueJob, done: any) => {
      console.info(`PROCESSING JOB ${job.id}, route: ${job.data.route}`);
      await this.handleMessage(job.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return done(null, job.id); // done - завершает джобу, но она остается в очереди как выполненная
    });

    this.worker.on("error", err => {
      this.logger.error(err.message);
    });

    this.producer.on("error", err => {
      this.logger.error(err.message);
    });
  }

  protected publish(partialPacket: ReadPacket, callback: (packet: WritePacket) => any): () => void {
    const packet = this.assignPacketId(partialPacket);
    const serializedPacket = this.serializer.serialize(packet);

    const jobId = `${serializedPacket.data.context!.transactionHash}_${serializedPacket.data.context!.logIndex}`;
    const job = this.producer.createJob(serializedPacket);
    void job
      .setId(jobId)
      .timeout(3000)
      .retries(2)
      .save() // вот тут джоба отправляется в редис
      .then((job: any) => {
        if (!job.id) {
          console.error("JOB NOT CREATED", jobId);
          return;
        }
        console.info("JOB CREATED", job.id);
        this.routingMap.set(job.id, callback);
      });

    return () => this.routingMap.delete(packet.id);
  }

  protected dispatchEvent(packet: ReadPacket): Promise<any> {
    const serializedPacket = this.serializer.serialize(packet);
    const jobId = `${serializedPacket.data.context!.transactionHash}_${serializedPacket.data.context!.logIndex}`;

    const job = this.producer.createJob(serializedPacket.data);
    return job
      .setId(jobId)
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

  public connect(): Promise<any> {
    if (!this.producer) {
      this.createClient();
    }
    return Promise.resolve();
  }

  public async handleMessage(message: IBeeQueueJobData): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = await this.deserializer.deserialize(message);
    const { route } = message;
    const callback = this.routingMap.get(route);

    if (!callback) {
      return undefined;
    }
    // eslint-disable-next-line n/no-callback-literal
    callback(rest);
  }

  public async close(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
    }
  }

  protected assignPacketId(packet: ReadPacket): ReadPacket & PacketId {
    const id = randomStringGenerator();
    return Object.assign(packet, { id });
  }
}
