import { Inject, Logger, LoggerService, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";

import { WsValidationPipe } from "@gemunion/nest-js-utils-ws";
import { FirebaseWsGuard } from "@gemunion/nest-js-guards-ws";

import { SessionInterceptor } from "../common/interceptors/session.ws";

@UsePipes(WsValidationPipe)
@UseInterceptors(SessionInterceptor)
@UseGuards(FirebaseWsGuard)
@WebSocketGateway()
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

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
