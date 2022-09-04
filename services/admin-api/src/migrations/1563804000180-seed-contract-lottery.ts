import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedContractLotteryAt1563804000180 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const lotteryAddr = process.env.LOTTERY_ADDR || wallet;
    const erc721ContractLotteryAddress = process.env.ERC721_LOTTERY_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1337;
    const fromBlock = process.env.STARTING_BLOCK || 0;

    // await queryRunner.query(`ALTER TYPE ${ns}.contract_module_enum ADD VALUE 'LOTTERY';`);

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
        contract_status,
        contract_type,
        contract_features,
        contract_module,
        from_block,
        created_at,
        updated_at
      ) VALUES (
        8,
        '${lotteryAddr}',
        '${chainId}',
        'LOTTERY',
        '${JSON.stringify({})}',
        '',
        'Lottery',
        '',
        '',
        'ACTIVE',
        'NATIVE',
        '{RANDOM}',
        'LOTTERY',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

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
        royalty,
        base_token_uri,
        contract_status,
        contract_type,
        contract_features,
        contract_module,
        from_block,
        created_at,
        updated_at
      ) VALUES (
        801,
        '${erc721ContractLotteryAddress}',
        '${chainId}',
        'LOTTERY TICKET',
        '${simpleFormatting}',
        '${imageUrl}',
        'LOTT',
        'LOTT721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{}',
        'LOTTERY',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 801, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
