import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther, ZeroAddress, ZeroHash } from "ethers";
import { subDays } from "date-fns";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedEventHistoryLootMixedPurchaseAt1687580606610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR;
    const erc721ContractRandomAddress = process.env.ERC721_RANDOM_ADDR;
    const erc998ContractRandomAddress = process.env.ERC998_RANDOM_ADDR;
    const erc1155ContractSimpleAddress = process.env.ERC1155_SIMPLE_ADDR;
    const erc721ContractLootBlacklistPausableAddress = process.env.ERC721_LOOTBOX_BLACKLIST_PAUSABLE_ADDR;

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
        102238110,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseLootBox',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1120601",
          item: {
            tokenType: 2,
            token: erc721ContractLootBlacklistPausableAddress,
            tokenId: "1120601",
            amount: "1",
          },
          price: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "1020101",
              amount: WeiPerEther.toString(),
            },
          ],
          content: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "1020101",
              amount: WeiPerEther.toString(),
            },
            {
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
            },
            {
              tokenType: 3,
              token: erc998ContractRandomAddress,
              tokenId: "1040601",
              amount: "1",
            },
            {
              tokenType: 4,
              token: erc1155ContractSimpleAddress,
              tokenId: "1050101",
              amount: "1000",
            },
          ],
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102238111,
        '${erc721ContractLootBlacklistPausableAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "112060101",
        })}',
        102238110,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102238112,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102238110,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
