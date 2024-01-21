import { MigrationInterface, QueryRunner } from "typeorm";

import { ns, networks } from "@framework/constants";

export class SeedNetwork1563803000070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.network (
        chain_id,
        chain_name,
        "order",
        rpc_urls,
        block_explorer_urls,
        native_currency
      ) VALUES ${Object.values(networks)
        .map(network => {
          return `(
          ${network.chainId},
          '${network.chainName}',
          ${network.order},
          '${JSON.stringify(network.rpcUrls)}',
          '${JSON.stringify(network.blockExplorerUrls)}',
          '${JSON.stringify(network.nativeCurrency)}'
        )`;
        })
        .join(",")};
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.network`);
  }
}
