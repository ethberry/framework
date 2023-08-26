import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther, ZeroHash } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedEventHistoryErc20TransferAt1563804040120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.event_history (
        id,
        address,
        transaction_hash,
        event_type,
        event_data,
        created_at,
        updated_at
      ) VALUES (
        10200001,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: wallets[1],
          value: WeiPerEther.toString(),
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10200002,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: wallets[2],
          value: WeiPerEther.toString(),
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10200003,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: wallets[0],
          value: WeiPerEther.toString(),
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10200004,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: wallets[2],
          value: WeiPerEther.toString(),
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10200005,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: wallets[0],
          value: WeiPerEther.toString(),
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10200006,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: wallets[1],
          value: WeiPerEther.toString(),
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
