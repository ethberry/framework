import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroAddress, ZeroHash } from "ethers";

import { wallets, NodeEnv } from "@ethberry/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryMysteryErc721UnpackAt1687580606330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const erc721ContractRandomAddress = process.env.ERC721_RANDOM_ADDR;
    const erc721ContractMysterySimpleAddress = process.env.ERC721_MYSTERYBOX_SIMPLE_ADDR;

    const now = new Date();
    const currentDateTime = now.toISOString();

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
        102083210,        
        '${erc721ContractMysterySimpleAddress}',
        '${ZeroHash}',
        'UnpackMysteryBox',
        '${JSON.stringify({
          account: wallets[0],
          tokenId: "111010101",
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102083211,
        '${erc721ContractMysterySimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: ZeroAddress,
          tokenId: "111010101",
        })}',
        102083210,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102083212,
        '${erc721ContractRandomAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103060101",
        })}',
        102083210,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
