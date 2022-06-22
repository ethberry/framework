import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

const usdt: Record<string, string> = {
  "1": "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "56": "0x55d398326f99059ff775485246999027b3197955",
  "1337": constants.AddressZero,
};

export class SeedErc20Token1563804010120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc20TokenAddress = process.env.ERC20_COIN || wallet;
    const chainId = process.env.CHAIN_ID || "1337";

    await queryRunner.query(`
      INSERT INTO ${ns}.erc20_token (
        title,
        description,
        amount,
        name,
        symbol,
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
        '${erc20TokenAddress}',
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
        'INACTIVE20',
        '${erc20TokenAddress}',
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
        'BL20',
        '${erc20TokenAddress}',
        'NEW',
        'BLACKLIST',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'USDT',
        '${simpleFormatting}',
        '${constants.WeiPerEther.toString()}',
        'USD Teter',
        'USDT',
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
