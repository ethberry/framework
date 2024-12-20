import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash } from "ethers";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedEventHistoryErc998TransferAt1563804040130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const erc998ContractSimpleAddress = process.env.ERC998_SIMPLE_ADDR;
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
        10400001,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: wallets[1],
          tokenId: "1",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10400002,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: wallets[2],
          tokenId: "2",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10400003,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: wallets[0],
          tokenId: "3",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10400004,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: wallets[2],
          tokenId: "4",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10400005,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: wallets[0],
          tokenId: "5",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10400006,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: wallets[1],
          tokenId: "6",
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
