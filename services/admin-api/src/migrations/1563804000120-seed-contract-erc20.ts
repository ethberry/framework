import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedContractErc20At1563804000120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const usdt: Record<string, string> = {
      "1": "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "56": "0x55d398326f99059ff775485246999027b3197955",
      "1337": process.env.USDT_ADDR || wallet,
    };
    const currentDateTime = new Date().toISOString();
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc20TokenInactiveAddress = process.env.ERC20_INACTIVE_ADDR || wallet;
    const erc20TokenNewAddress = process.env.ERC20_NEW_ADDR || wallet;
    const erc20TokenBlackListAddress = process.env.ERC20_BLACKLIST_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1337;
    const fromBloack = process.env.STARTING_BLOCK || 0;

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
        201,
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
        '{}',
        '${fromBloack}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        202,
        '${erc20TokenInactiveAddress}',
        '${chainId}',
        'ERC20 (inactive)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC20 INACTIVE',
        'OFF20',
        18,
        0,
        '',
        'INACTIVE',
        'ERC20',
        '{}',
        '${fromBloack}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        203,
        '${erc20TokenNewAddress}',
        '${chainId}',
        'ERC20 (new)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC20 NEW',
        'NEW20',
        18,
        0,
        '',
        'NEW',
        'ERC20',
        '{}',
        '${fromBloack}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        204,
        '${erc20TokenBlackListAddress}',
        '${chainId}',
        'ERC20 (blacklist)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC20 BLACKLIST',
        'BL20',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{BLACKLIST}',
        '${fromBloack}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        205,
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
        '{EXTERNAL}',
        '${fromBloack}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        211,
        '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        '56',
        'BUSD',
        '${simpleFormatting}',
        '${imageUrl}',
        'Biance USD',
        'BUSD',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBloack}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 211, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
