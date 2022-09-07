import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedContractErc20WETHAt1563804000122 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const addr: Record<string, string> = {
      "1": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "56": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
      "137": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      "1337": process.env.WETH_ADDR || wallet,
    };
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || 1337;
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
        decimals,
        royalty,
        base_token_uri,
        contract_status,
        contract_type,
        contract_features,
        from_block,
        created_at,
        updated_at
      ) VALUES (
        206,
        '${addr[chainId]}',
        '${chainId}',
        'WETH',
        '${simpleFormatting}',
        '${imageUrl}',
        'Wrapped ETH',
        'WETH',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
