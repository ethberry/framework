import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

const usdt: Record<string, string> = {
  "1": "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "56": "0x55d398326f99059ff775485246999027b3197955",
  "1337": process.env.ERC20_USDT_ADDR || wallet,
};

export class SeedContractErc20At1563804000120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc20TokenInactiveAddress = process.env.ERC20_INACTIVE_ADDR || wallet;
    const erc20TokenNewAddress = process.env.ERC20_NEW_ADDR || wallet;
    const erc20TokenBlackListAddress = process.env.BLACKLIST_ADDR || wallet;
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
        contract_template,
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
        'ERC20',
        'NATIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        '${erc20TokenSimpleAddress}',
        '${chainId}',
        'Space Credits',
        '${simpleFormatting}',
        '${imageUrl}',
        'Space Credits',
        'GEM20',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        '${erc20TokenInactiveAddress}',
        '${chainId}',
        'Inactive token',
        '${simpleFormatting}',
        '${imageUrl}',
        'Inactive token',
        'OFF20',
        18,
        0,
        '',
        'INACTIVE',
        'ERC20',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        '${erc20TokenNewAddress}',
        '${chainId}',
        'New token',
        '${simpleFormatting}',
        '${imageUrl}',
        'New token',
        'NEW20',
        18,
        0,
        '',
        'NEW',
        'ERC20',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        '${erc20TokenBlackListAddress}',
        '${chainId}',
        'Black list token',
        '${simpleFormatting}',
        '${imageUrl}',
        'Black list token',
        'BLM20',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        'BLACKLIST',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        6,
        '${usdt[chainId]}',
        '${chainId}',
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        'Tether USD',
        'USDT',
        6,
        0,
        '',
        'ACTIVE',
        'ERC20',
        'EXTERNAL',
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
