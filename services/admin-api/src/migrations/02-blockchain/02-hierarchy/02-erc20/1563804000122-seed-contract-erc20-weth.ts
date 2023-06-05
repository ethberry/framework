import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId } from "@framework/constants";

export class SeedContractErc20WETHAt1563804000122 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const fromBlock = process.env.STARTING_BLOCK || 0;
    const chainId = process.env.CHAIN_ID || testChainId;
    const wethAddr = process.env.WETH_ADDR || wallet;

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
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        1216,
        '${wethAddr}',
        '${chainId}',
        'WETH',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fweth.png?alt=media&token=ea038e2a-c284-4727-bf24-ddf80bc96d46',
        'Wrapped ETH',
        'WETH',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2216,
        '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
        56,
        'WETH',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fweth.png?alt=media&token=ea038e2a-c284-4727-bf24-ddf80bc96d46',
        'Wrapped ETH',
        'WETH',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3216,
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        1,
        'WETH',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fweth.png?alt=media&token=ea038e2a-c284-4727-bf24-ddf80bc96d46',
        'Wrapped ETH',
        'WETH',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4216,
        '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
        137,
        'WETH',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fweth.png?alt=media&token=ea038e2a-c284-4727-bf24-ddf80bc96d46',
        'Wrapped ETH',
        'WETH',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
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
