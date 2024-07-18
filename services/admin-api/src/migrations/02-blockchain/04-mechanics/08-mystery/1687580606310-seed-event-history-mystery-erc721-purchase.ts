import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther, ZeroAddress, ZeroHash } from "ethers";
import { subDays } from "date-fns";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedEventHistoryMysteryErc721PurchaseAt1687580606310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR;
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
        102083110,
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
        102083111,
        '${erc721ContractMysterySimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "111010101",
        })}',
        102083110,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        102083112,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102083110,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        102083120,
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
        102083121,
        '${erc721ContractMysterySimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "111010102",
        })}',
        102083120,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        102083122,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102083120,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        102083130,
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
        102083131,
        '${erc721ContractMysterySimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "111010103",
        })}',
        102083130,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        102083132,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102083130,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        102083140,
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
        102083141,
        '${erc721ContractMysterySimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[1],
          tokenId: "111010104",
        })}',
        102083140,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        102083142,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102083140,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        102083150,
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
        102083151,
        '${erc721ContractMysterySimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[2],
          tokenId: "111010105",
        })}',
        102083150,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        102083152,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102083150,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
