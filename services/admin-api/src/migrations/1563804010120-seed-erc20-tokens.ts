import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

const usdt: Record<string, string> = {
  "1": "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "56": "0x55d398326f99059ff775485246999027b3197955",
  "1337": process.env.ERC20_USDT_ADDR || wallet,
};

export class SeedErc20Token1563804010120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc20TokenActiveAddress = process.env.ERC20_ACTIVE_ADDR || wallet;
    const erc20TokenInactiveAddress = process.env.ERC20_INACTIVE_ADDR || wallet;
    const erc20TokenNewAddress = process.env.ERC20_NEW_ADDR || wallet;
    const erc20TokenBlackListAddress = process.env.ERC20_BLACKLIST_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || "1337";

    await queryRunner.query(`
      INSERT INTO ${ns}.erc20_token (
        title,
        description,
        amount,
        name,
        symbol,
        decimals,
        address,
        token_status,
        contract_template,
        chain_id,
        created_at,
        updated_at
      ) VALUES (
        'Native token (ETH)',
        '${simpleFormatting}',
        '${constants.WeiPerEther.toString()}',
        'Ethereum',
        'ETH',
        18,
        '${constants.AddressZero}',
        'ACTIVE',
        'NATIVE',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Space Credits',
        '${simpleFormatting}',
        '${constants.WeiPerEther.toString()}',
        'Space Credits',
        'GEM20',
        18,
        '${erc20TokenActiveAddress}',
        'ACTIVE',
        'SIMPLE',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Inactive token',
        '${simpleFormatting}',
        '${constants.WeiPerEther.toString()}',
        'Inactive token',
        'OFF20',
        18,
        '${erc20TokenInactiveAddress}',
        'INACTIVE',
        'SIMPLE',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'New token',
        '${simpleFormatting}',
        '${constants.WeiPerEther.toString()}',
        'New token',
        'NEW20',
        18,
        '${erc20TokenNewAddress}',
        'NEW',
        'SIMPLE',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Black list token',
        '${simpleFormatting}',
        '${constants.WeiPerEther.toString()}',
        'Black list token',
        'BLM20',
        18,
        '${erc20TokenBlackListAddress}',
        'ACTIVE',
        'BLACKLIST',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'USDT',
        '${simpleFormatting}',
        '100000000000',
        'Tether USD',
        'USDT',
        6,
        '${usdt[chainId]}',
        'ACTIVE',
        'EXTERNAL',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc20_token RESTART IDENTITY CASCADE;`);
  }
}
