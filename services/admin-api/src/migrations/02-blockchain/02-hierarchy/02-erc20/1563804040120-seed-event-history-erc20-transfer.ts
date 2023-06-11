import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash, WeiPerEther } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc20TransferAt1563804040120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
        1200001,
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
        1200002,
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
        1200003,
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
        1200004,
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
        1200005,
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
        1200006,
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
