import { transformPatternToRoute } from "@nestjs/microservices/utils";
import { PATTERN_METADATA } from "@nestjs/microservices/constants";

import { DiscoveredMethodWithMeta, DiscoveryService } from "@golevelup/nestjs-discovery";

export const getHandlerByPattern = async <T extends Array<Record<string, string>>>(
  route: string,
  discoveryService: DiscoveryService,
): Promise<Array<DiscoveredMethodWithMeta<T>>> => {
  const methods = await discoveryService.controllerMethodsWithMetaAtKey<T>(PATTERN_METADATA);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return methods.filter(method => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return method.meta.some(meta => transformPatternToRoute(meta) === route);
  });
};
