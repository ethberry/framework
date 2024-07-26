import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroAddress, ZeroHash } from "ethers";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedClaimTemplateErc721EventHistoryAt1653616447930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR;
    const erc721ContractSimpleAddress = process.env.ERC721_SIMPLE_ADDR;
    const erc721ContractRandomAddress = process.env.ERC721_RANDOM_ADDR;
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
        103020100,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 3,
          items: [
            {
              tokenType: 2,
              token: erc721ContractSimpleAddress,
              tokenId: "1030101",
              amount: "1",
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        103020101,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103010101",
        })}',
        103020100,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        103020200,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 3,
          items: [
            {
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        103020201,
        '${erc721ContractRandomAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103060101",
        })}',
        103020200,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        103020300,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 3,
          items: [
            {
              tokenType: 2,
              token: erc721ContractSimpleAddress,
              tokenId: "1030101",
              amount: "1",
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        103020301,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103010101",
        })}',
        103020300,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
