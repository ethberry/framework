import { Inject, Logger, LoggerService, UseGuards, UsePipes } from "@nestjs/common";
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { User } from "@gemunion/nest-js-utils";
import { WsValidationPipe } from "@gemunion/nest-js-utils-ws";
import { FirebaseWsGuard } from "@gemunion/nest-js-guards-ws";
import { UserEntity } from "../../infrastructure/user/user.entity";
import { FirebaseWsStrategy } from "../../infrastructure/auth/strategies";

@UsePipes(WsValidationPipe)
@UseGuards(FirebaseWsGuard)
@WebSocketGateway()
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly firebaseWsStrategy: FirebaseWsStrategy,
  ) {}

  @SubscribeMessage("ping")
  public async pong(
    @ConnectedSocket() client: Socket,
    @MessageBody() ping: any,
    @User() userEntity: UserEntity,
  ): Promise<any> {
    console.log(client);
    console.log(ping);
    console.log(userEntity);
    await client.join(userEntity.wallet);
    return { pong: true };
  }

  public afterInit(): void {
    this.loggerService.log("Init", EventGateway.name);
  }

  public handleDisconnect(client: Socket): void {
    this.loggerService.log(`Client disconnected: ${client.id}`, EventGateway.name);
  }

  public handleConnection(client: Socket): void {
    this.loggerService.log(`Client connected: ${client.id}`, EventGateway.name);
  }
}
