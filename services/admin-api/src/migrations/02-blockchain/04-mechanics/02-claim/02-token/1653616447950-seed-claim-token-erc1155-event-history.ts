import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash } from "ethers";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedClaimTokenErc1155EventHistoryAt1653616447950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR;
    const erc1155ContractSimpleAddress = process.env.ERC1155_SIMPLE_ADDR;
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.event_history (
        id,
        address,
        transaction_hash,
        event_type,
        event_data,
        parent_id,
        created_at,
        updated_at
      ) VALUES (
        105020110,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 3,
          items: [
            {
              tokenType: 4,
              token: erc1155ContractSimpleAddress,
              tokenId: "1050101",
              amount: "1000",
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        105020111,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: exchangeAddress,
          from: wallets[0],
          to: wallets[1],
          id: "105010101",
          value: "1000",
        })}',
        105020110,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        105020210,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 3,
          items: [
            {
              tokenType: 4,
              token: erc1155ContractSimpleAddress,
              tokenId: "1050101",
              amount: "1000",
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        105020211,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferBatch',
        '${JSON.stringify({
          operator: exchangeAddress,
          from: wallets[0],
          to: wallets[1],
          ids: ["105040101", "105040102", "105040103"],
          values: ["1000", "1000", "1000"],
        })}',
        105020210,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
