import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom, map } from "rxjs";

const baseUrl = "https://api.1inch.dev";

@Injectable()
export class OneInchService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async getTokenList(dto: { chainId: number }): Promise<any> {
    const { chainId } = dto;
    return this.sendRequest(`/token/v1.2/${chainId}/token-list`, { provider: "1inch" });
  }

  public async getQuote(dto: any): Promise<any> {
    const { chainId, ...rest } = dto;
    return this.sendRequest(`/swap/v5.2/${chainId}/quote`, { ...rest });
  }

  public async swap(dto: any): Promise<any> {
    const { chainId, ...rest } = dto;
    return this.sendRequest(`/swap/v5.2/${chainId}/swap`, { ...rest });
  }

  public async approve(dto: any): Promise<any> {
    const { chainId, ...rest } = dto;
    return this.sendRequest(`/swap/v5.2/${chainId}/approve/transaction`, { ...rest });
  }

  private sendRequest<T>(url: string, params: Record<string, any>): Promise<T> {
    const apiKey = this.configService.get<string>("ONE_INCH_API_KEY", "");

    const response = this.httpService
      .request({
        url: `${baseUrl}${url}`,
        params,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .pipe(map((response: { data: T }) => response.data));

    return firstValueFrom(response);
  }
}
