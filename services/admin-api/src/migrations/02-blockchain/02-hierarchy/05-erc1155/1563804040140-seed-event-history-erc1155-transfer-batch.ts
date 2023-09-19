import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroAddress, ZeroHash } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedEventHistoryErc1155TransferBatchAt1563804040140 implements MigrationInterface {
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
        10500201,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferBatch',
        '${JSON.stringify({
          operator: ZeroAddress,
          from: wallets[0],
          to: wallets[1],
          ids: ["105010201", "105010301"],
          values: ["1000", "1000"],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10500202,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferBatch',
        '${JSON.stringify({
          operator: ZeroAddress,
          from: wallets[0],
          to: wallets[2],
          ids: ["105010201", "105010301"],
          values: ["1000", "1000"],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10500203,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferBatch',
        '${JSON.stringify({
          operator: ZeroAddress,
          from: wallets[1],
          to: wallets[0],
          ids: ["105010201", "105010301"],
          values: ["1000", "1000"],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10500204,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferBatch',
        '${JSON.stringify({
          operator: ZeroAddress,
          from: wallets[1],
          to: wallets[2],
          ids: ["105010201", "105010301"],
          values: ["1000", "1000"],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10500205,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferBatch',
        '${JSON.stringify({
          operator: ZeroAddress,
          from: wallets[2],
          to: wallets[0],
          ids: ["105010201", "105010301"],
          values: ["1000", "1000"],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10500206,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferBatch',
        '${JSON.stringify({
          operator: ZeroAddress,
          from: wallets[2],
          to: wallets[1],
          ids: ["105010201", "105010301"],
          values: ["1000", "1000"],
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
