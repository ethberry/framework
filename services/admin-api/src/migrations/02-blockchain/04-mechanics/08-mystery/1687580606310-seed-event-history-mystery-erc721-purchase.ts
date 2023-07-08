import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther, ZeroAddress, ZeroHash } from "ethers";
import { subDays } from "date-fns";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryMysteryErc721PurchaseAt1687580606310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc721ContractRandomAddress = process.env.ERC721_RANDOM_ADDR || wallet;
    const erc721ContractMysterySimpleAddress = process.env.ERC721_MYSTERYBOX_SIMPLE_ADDR || wallet;

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
        102110110,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseMysteryBox',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1110101",
          item: [
            {
              tokenType: 2,
              token: erc721ContractMysterySimpleAddress,
              tokenId: "1110101",
              amount: "1",
            },
            {
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
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
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        102110111,
        '${erc721ContractMysterySimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "111010101",
        })}',
        102110110,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        102110112,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102110110,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        102110120,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseMysteryBox',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1110101",
          item: [
            {
              tokenType: 2,
              token: erc721ContractMysterySimpleAddress,
              tokenId: "1110101",
              amount: "1",
            },
            {
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
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
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        102110121,
        '${erc721ContractMysterySimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "111010102",
        })}',
        102110120,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        102110122,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102110120,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        102110130,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseMysteryBox',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1110101",
          item: [
            {
              tokenType: 2,
              token: erc721ContractMysterySimpleAddress,
              tokenId: "1110101",
              amount: "1",
            },
            {
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
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
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        102110131,
        '${erc721ContractMysterySimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "111010103",
        })}',
        102110130,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        102110132,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102110130,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        102110140,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseMysteryBox',
        '${JSON.stringify({
          account: wallets[1],
          externalId: "1110101",
          item: [
            {
              tokenType: 2,
              token: erc721ContractMysterySimpleAddress,
              tokenId: "1110101",
              amount: "1",
            },
            {
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
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
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        102110141,
        '${erc721ContractMysterySimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[1],
          tokenId: "111010104",
        })}',
        102110140,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        102110142,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102110140,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        102110150,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseMysteryBox',
        '${JSON.stringify({
          account: wallets[2],
          externalId: "1110101",
          item: [
            {
              tokenType: 2,
              token: erc721ContractMysterySimpleAddress,
              tokenId: "1110101",
              amount: "1",
            },
            {
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
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
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        102110151,
        '${erc721ContractMysterySimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[2],
          tokenId: "111010105",
        })}',
        102110150,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        102110152,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102110150,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
