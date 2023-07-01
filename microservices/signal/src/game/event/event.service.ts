import { Injectable } from "@nestjs/common";
import { EventGateway } from "./event.gateway";
import { IMessageDto } from "./interfaces";

@Injectable()
export class EventService {
  constructor(private readonly eventGateway: EventGateway) {}

  public sendMessage(dto: IMessageDto): void {
    console.log("sendMessage", dto);
    this.eventGateway.server.to("0xfe3b557e8fb62b89f4916b721be55ceb828dbd73").emit("txHash", dto);
  }
}
