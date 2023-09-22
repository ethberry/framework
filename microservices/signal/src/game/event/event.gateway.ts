import { Inject, Logger, LoggerService, UseGuards, UsePipes } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

import { User } from "@gemunion/nest-js-utils";
import { WsValidationPipe } from "@gemunion/nest-js-utils-ws";
import { FirebaseWsGuard } from "@gemunion/nest-js-guards-ws";
import { SignalEventType } from "@framework/types";

import { UserEntity } from "../../infrastructure/user/user.entity";

@UsePipes(WsValidationPipe)
@UseGuards(FirebaseWsGuard)
@WebSocketGateway({ cors: true })
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  @SubscribeMessage(SignalEventType.PING)
  public async ping(
    @ConnectedSocket() client: Socket,
    @MessageBody() ping: any,
    @User() userEntity: UserEntity,
  ): Promise<any> {
    // console.log(client);
    console.info(ping);
    console.info(userEntity);
    await client.join(userEntity.wallet);
    return { [SignalEventType.PONG]: true };
  }

  public afterInit(): void {
    instrument(this.server, {
      auth: false,
    });
    this.loggerService.log("Init", EventGateway.name);
  }

  public handleDisconnect(client: Socket): void {
    this.loggerService.log(`Client disconnected: ${client.id}`, EventGateway.name);
  }

  public handleConnection(client: Socket): void {
    this.loggerService.log(`Client connected: ${client.id}`, EventGateway.name);
  }
}
