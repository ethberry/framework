import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash, ZeroAddress } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc1155TransferBatchAt1563804040140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
          id: ["105010201", "105010301"],
          value: ["1000", "1000"],
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
          id: ["105010201", "105010301"],
          value: ["1000", "1000"],
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
          id: ["105010201", "105010301"],
          value: ["1000", "1000"],
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
          id: ["105010201", "105010301"],
          value: ["1000", "1000"],
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
          id: ["105010201", "105010301"],
          value: ["1000", "1000"],
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
          id: ["105010201", "105010301"],
          value: ["1000", "1000"],
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