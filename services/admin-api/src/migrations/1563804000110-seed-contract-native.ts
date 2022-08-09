import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedContractNativeAt1563804000110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || "1337";

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
        decimals,
        royalty,
        base_token_uri,
        contract_status,
        contract_type,
        contract_features,
        created_at,
        updated_at
      ) VALUES (
        1,
        '${constants.AddressZero}',
        '${chainId}',
        'Native token (ETH)',
        '${simpleFormatting}',
        '${imageUrl}',
        'Ethereum',
        'ETH',
        18,
        0,
        '',
        'ACTIVE',
        'NATIVE',
        '{NATIVE}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 6, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
