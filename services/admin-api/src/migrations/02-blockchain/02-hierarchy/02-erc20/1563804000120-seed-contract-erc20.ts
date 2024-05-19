import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imagePath, ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedContractErc20At1563804000120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc20TokenInactiveAddress = process.env.ERC20_INACTIVE_ADDR || wallet;
    const erc20TokenNewAddress = process.env.ERC20_NEW_ADDR || wallet;
    const erc20TokenBlackListAddress = process.env.ERC20_BLACKLIST_ADDR || wallet;
    const erc20TokenWhiteListAddress = process.env.ERC20_WHITELIST_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || testChainId;
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
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        10201,
        '${erc20TokenSimpleAddress}',
        '${chainId}',
        'Space Credits',
        '${simpleFormatting}',
        '${imagePath}/space_credit.png',
        'Space Credits',
        'GEM20',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10202,
        '${erc20TokenInactiveAddress}',
        '${chainId}',
        'ERC20 (inactive)',
        '${simpleFormatting}',
        '${imagePath}/space_credit.png',
        'ERC20 INACTIVE',
        'OFF20',
        18,
        0,
        '',
        'INACTIVE',
        'ERC20',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10203,
        '${erc20TokenNewAddress}',
        '${chainId}',
        'ERC20 (new)',
        '${simpleFormatting}',
        '${imagePath}/space_credit.png',
        'ERC20 NEW',
        'NEW20',
        18,
        0,
        '',
        'NEW',
        'ERC20',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10204,
        '${erc20TokenBlackListAddress}',
        '${chainId}',
        'ERC20 (blacklist)',
        '${simpleFormatting}',
        '${imagePath}/space_credit.png',
        'ERC20 BLACKLIST',
        'BL20',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{BLACKLIST}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10205,
        '${erc20TokenWhiteListAddress}',
        '${chainId}',
        'ERC20 (whitelist)',
        '${simpleFormatting}',
        '${imagePath}/space_credit.png',
        'ERC20 WHITELIST',
        'WL20',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{WHITELIST}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10280,
        '${erc20TokenInactiveAddress}',
        '${chainId}',
        'Warp Credits',
        '${simpleFormatting}',
        '${imagePath}/space_credit.png',
        'Warp Credits',
        'WARP20',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{}',
        '${fromBlock}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20201,
        '${erc20TokenSimpleAddress}',
        56,
        'BEP Credits',
        '${simpleFormatting}',
        '${imagePath}/space_credit.png',
        'BEP Credits',
        'BEP20',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{}',
        '${fromBlock}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
