import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther, ZeroAddress, ZeroHash } from "ethers";
import { subDays } from "date-fns";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedEventHistoryMysteryMixedUnpackAt1687580606630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR;
    const erc721ContractRandomAddress = process.env.ERC721_RANDOM_ADDR;
    const erc998ContractRandomAddress = process.env.ERC998_RANDOM_ADDR;
    const erc1155ContractSimpleAddress = process.env.ERC1155_SIMPLE_ADDR;
    const erc721ContractMysteryBlacklistPausableAddress = process.env.ERC721_MYSTERYBOX_BLACKLIST_PAUSABLE_ADDR;

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
        102088210,
        '${erc721ContractMysteryBlacklistPausableAddress}',
        '${ZeroHash}',
        'UnpackMysteryBox',
        '${JSON.stringify({
          account: wallets[0],
          tokenId: "111060101",
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        102088211,
        '${erc721ContractMysteryBlacklistPausableAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: ZeroAddress,
          tokenId: "111060101",
        })}',
        102088210,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102088212,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          amount: WeiPerEther.toString(),
        })}',
        102088210,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102088213,
        '${erc721ContractRandomAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103060101",
        })}',
        102088210,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102088214,
        '${erc998ContractRandomAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104060101",
        })}',
        102088210,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102088215,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: exchangeAddress,
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "105010101",
          amount: "1000",
        })}',
        102088210,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
