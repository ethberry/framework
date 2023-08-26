import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroAddress, ZeroHash } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedEventHistoryErc1155TransferSingleAt1563804040130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const erc1155ContractSimpleAddress = process.env.ERC1155_SIMPLE_ADDR || wallet;
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
        10500101,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: ZeroAddress,
          from: wallets[0],
          to: wallets[1],
          id: "105010101",
          value: "1000",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10500102,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: ZeroAddress,
          from: wallets[0],
          to: wallets[2],
          id: "105010101",
          value: "1000",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10500103,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: ZeroAddress,
          from: wallets[1],
          to: wallets[0],
          id: "105010101",
          value: "1000",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10500104,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: ZeroAddress,
          from: wallets[1],
          to: wallets[2],
          id: "105010101",
          value: "1000",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10500105,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: ZeroAddress,
          from: wallets[2],
          to: wallets[0],
          id: "105010101",
          value: "1000",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10500106,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: ZeroAddress,
          from: wallets[2],
          to: wallets[1],
          id: "105010101",
          value: "1000",
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
