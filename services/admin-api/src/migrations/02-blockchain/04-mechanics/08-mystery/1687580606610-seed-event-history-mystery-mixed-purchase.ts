import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther, ZeroAddress, ZeroHash } from "ethers";
import { subDays } from "date-fns";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryMysteryMixedPurchaseAt1687580606610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc721ContractRandomAddress = process.env.ERC721_RANDOM_ADDR || wallet;
    const erc998ContractRandomAddress = process.env.ERC998_RANDOM_ADDR || wallet;
    const erc1155ContractSimpleAddress = process.env.ERC1155_SIMPLE_ADDR || wallet;
    const erc721ContractMysteryBlacklistPausableAddress =
      process.env.ERC721_MYSTERYBOX_BLACKLIST_PAUSABLE_ADDR || wallet;

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
        102110210,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseMysteryBox',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1110601",
          item: [
            {
              tokenType: 2,
              token: erc721ContractMysteryBlacklistPausableAddress,
              tokenId: "1110601",
              amount: "1",
            },
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
          price: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "1020101",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102110211,
        '${erc721ContractMysteryBlacklistPausableAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "111060101",
        })}',
        102110210,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102110212,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102110210,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
