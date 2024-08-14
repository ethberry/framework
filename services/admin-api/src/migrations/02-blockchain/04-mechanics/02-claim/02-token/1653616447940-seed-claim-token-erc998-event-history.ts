import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroAddress, ZeroHash } from "ethers";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedClaimTokenErc998EventHistoryAt1653616447940 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR;
    const erc998ContractSimpleAddress = process.env.ERC998_SIMPLE_ADDR;
    const erc998ContractRandomAddress = process.env.ERC998_RANDOM_ADDR;
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
        104020110,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 3,
          items: [
            {
              tokenType: 3,
              token: erc998ContractSimpleAddress,
              tokenId: "1040101",
              amount: "1",
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        104020111,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104010101",
        })}',
        104020110,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        104020210,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 3,
          items: [
            {
              tokenType: 3,
              token: erc998ContractRandomAddress,
              tokenId: "1040601",
              amount: "1",
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        104020211,
        '${erc998ContractRandomAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104060101",
        })}',
        104020210,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        104020310,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 3,
          items: [
            {
              tokenType: 3,
              token: erc998ContractSimpleAddress,
              tokenId: "1040101",
              amount: "1",
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        104020311,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104010101",
        })}',
        104020310,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
