// import { Controller, INestApplication, Inject, Injectable, Module } from "@nestjs/common";
// import { Test, TestingModule } from "@nestjs/testing";
// import { ClientProxy, ClientsModule, MessagePattern } from "@nestjs/microservices";
// import { firstValueFrom } from "rxjs";
// import Queue from "bee-queue";
//
// import { BeeServer } from "./bee.server";
// import { BeeClient } from "./bee.client";
//
// const BEE_SERVICE = "BEE_SERVICE";
// const EVENT_NAME = "ETH_EVENTS";
//
// const url = "redis://localhost:6379/";
//
// @Injectable()
// class BeeService {
//   constructor(
//     @Inject(BEE_SERVICE)
//     private readonly beeClientProxy: ClientProxy,
//   ) {}
//
//   public receive<T = any>(data: T): Promise<T> {
//     return Promise.resolve(data);
//   }
//
//   public emit(data: any): Promise<void> {
//     const res = this.beeClientProxy.emit<void, any>(EVENT_NAME, data);
//     return firstValueFrom(res);
//   }
//
//   public send(data: any): Promise<any> {
//     const res = this.beeClientProxy.send<string, any>(EVENT_NAME, data);
//     return firstValueFrom(res);
//   }
//
//   public error(data: any): Promise<any> {
//     const res = this.beeClientProxy.send<string, any>("NON_EXISTING_EVENT_NAME", data);
//     return firstValueFrom(res);
//   }
// }
//
// @Controller()
// class BeeController {
//   constructor(private readonly beeService: BeeService) {}
//
//   @MessagePattern(EVENT_NAME)
//   public receive<T = any>(data: T): Promise<T> {
//     return this.beeService.receive(data);
//   }
// }
//
// @Module({
//   imports: [
//     ClientsModule.register([
//       {
//         name: BEE_SERVICE,
//         customClass: BeeClient,
//         options: {
//           url,
//         },
//       },
//     ]),
//   ],
//   controllers: [BeeController],
//   providers: [BeeService],
// })
// class BeeModule {}
//
// describe("BeeServer", () => {
//   let app: INestApplication;
//   let beeService: BeeService;
//
//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [BeeModule],
//     }).compile();
//     app = module.createNestApplication();
//     app.connectMicroservice({
//       strategy: new BeeServer({
//         url,
//       }),
//     });
//     await app.startAllMicroservices();
//
//     beeService = module.get<BeeService>(BeeService);
//   });
//
//   afterAll(async () => {
//     await app.close();
//   });
//
//   it("should be defined", () => {
//     expect(app).toBeDefined();
//   });
//
//   describe("BeeService", () => {
//     let logSpy: jest.SpyInstance;
//
//     beforeEach(() => {
//       logSpy = jest.spyOn(beeService, "receive");
//     });
//
//     afterEach(() => {
//       logSpy.mockClear();
//     });
//
//     it("should emit event", async () => {
//       const data = { test: true };
//       const result = await beeService.emit(data);
//
//       await new Promise(resolve => setTimeout(resolve, 1000));
//
//       expect(result).toHaveLength(1);
//       expect(logSpy).toBeCalledTimes(1);
//     });
//
//     it("should receive event", async () => {
//       const data = { test: true };
//       const params = {
//         // тестовый мессадж
//       };
//
//       const sendQueue = new Queue("ETH_EVENTS", {
//         isWorker: false, // по умолчанию создаются воркеры
//         getEvents: false,
//         redis: {
//           url,
//         },
//       });
//
//       const job = sendQueue.createJob({ x: 2, y: 3 });
//       const result = await job
//         .setId("my_own_job_id") // можно опустить, тогда само присвоит уникальный id
//         .timeout(3000)
//         .retries(2)
//         .save() // вот тут джоба отправляется в редис
//         .then((job: any) => {
//           console.log("JOB CREATED", job.id);
//           // если job.id = null, значит 'my_own_job_id' уже есть в очереди
//         });
//
//       await new Promise(resolve => setTimeout(resolve, 1000));
//
//       expect(result).toBeDefined();
//       expect(logSpy).toBeCalledTimes(1);
//     });
//
//     it("should send/receive event", async () => {
//       const data = { test: true };
//       const result = await beeService.send(data);
//
//       await new Promise(resolve => setTimeout(resolve, 1000));
//
//       expect(result).toEqual(data);
//       expect(logSpy).toBeCalledTimes(1);
//     });
//
//     it("should handle absent handler", async () => {
//       const data = { test: true };
//       const params = {
//         // тестовый мессадж
//       };
//
//       const sendQueue = new Queue("ETH_EVENTS", {
//         isWorker: false, // по умолчанию создаются воркеры
//         getEvents: false,
//         redis: {
//           url,
//         },
//       });
//       const job = sendQueue.createJob({ x: 2, y: 3 });
//       const result = await job
//         .setId("my_own_job_id") // можно опустить, тогда само присвоит уникальный id
//         .timeout(3000)
//         .retries(2)
//         .save() // вот тут джоба отправляется в редис
//         .then((job: any) => {
//           console.log("JOB CREATED", job.id);
//           // если job.id = null, значит 'my_own_job_id' уже есть в очереди
//         });
//
//       await new Promise(resolve => setTimeout(resolve, 1000));
//
//       expect(result).toBeDefined();
//     });
//   });
// });
