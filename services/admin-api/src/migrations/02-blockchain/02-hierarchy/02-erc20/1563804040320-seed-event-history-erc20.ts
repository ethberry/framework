import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc20At1563804040320 implements MigrationInterface {
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
        401001,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: wallets[1],
          value: constants.WeiPerEther.toString(),
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        401002,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: wallets[2],
          value: constants.WeiPerEther.toString(),
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        401003,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: wallets[0],
          value: constants.WeiPerEther.toString(),
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        401004,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: wallets[2],
          value: constants.WeiPerEther.toString(),
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        401005,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: wallets[0],
          value: constants.WeiPerEther.toString(),
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        401006,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: wallets[1],
          value: constants.WeiPerEther.toString(),
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
