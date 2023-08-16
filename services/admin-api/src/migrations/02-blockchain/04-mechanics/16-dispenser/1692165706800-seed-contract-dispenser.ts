import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { wallet } from "@gemunion/constants";
import { imageUrl, ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedContractDispenserAt1692165706800 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;
    const dispenserAddr = process.env.DISPENSER_ADDR || wallet;
    const fromBlock = process.env.STARTING_BLOCK || 0;

    await queryRunner.query(`
        INSERT INTO ${ns}.contract (
          id,
          address,
          chain_id,
          title,
          description,
          image_url,
          name,
          symbol,
          base_token_uri,
          parameters,
          contract_status,
          contract_type,
          contract_features,
          contract_module,
          from_block,
          merchant_id,
          created_at,
          updated_at
        ) VALUES (
          ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 108},
          '${dispenserAddr}',
          '${chainId}',
          'DISPENSER',
          '${simpleFormatting}',
          '${imageUrl}',
          'Dispenser',
          '',
          '',
          '${JSON.stringify({})}',
          'ACTIVE',
          null,
          '{}',
          'DISPENSER',
          '${fromBlock}',
          1,
          '${currentDateTime}',
          '${currentDateTime}'
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
