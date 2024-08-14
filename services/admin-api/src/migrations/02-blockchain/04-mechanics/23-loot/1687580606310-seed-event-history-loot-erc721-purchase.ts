import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther, ZeroAddress, ZeroHash } from "ethers";
import { subDays } from "date-fns";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedEventHistoryLootErc721PurchaseAt1687580606310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR;
    const erc721ContractRandomAddress = process.env.ERC721_RANDOM_ADDR;
    const erc721ContractLootSimpleAddress = process.env.ERC721_LOOTBOX_SIMPLE_ADDR;

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
        102233110,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseLootBox',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1120101",
          item: {
            tokenType: 2,
            token: erc721ContractLootSimpleAddress,
            tokenId: "1120101",
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
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
            },
          ],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        102233111,
        '${erc721ContractLootSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "112010101",
        })}',
        102233110,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        102233112,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102233110,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        102233120,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseLootBox',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1120101",
          item: {
            tokenType: 2,
            token: erc721ContractLootSimpleAddress,
            tokenId: "1120101",
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
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
            },
          ],
        })}',
        null,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        102233121,
        '${erc721ContractLootSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "112010102",
        })}',
        102233120,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        102233122,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102233120,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        102233130,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseLootBox',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1120101",
          item: {
            tokenType: 2,
            token: erc721ContractLootSimpleAddress,
            tokenId: "1120101",
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
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
            },
          ],
        })}',
        null,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        102233131,
        '${erc721ContractLootSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "112010103",
        })}',
        102233130,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        102233132,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102233130,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        102233140,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseLootBox',
        '${JSON.stringify({
          account: wallets[1],
          externalId: "1120101",
          item: {
            tokenType: 2,
            token: erc721ContractLootSimpleAddress,
            tokenId: "1120101",
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
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
            },
          ],
        })}',
        null,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        102233141,
        '${erc721ContractLootSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[1],
          tokenId: "112010104",
        })}',
        102233140,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        102233142,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102233140,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        102233150,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseLootBox',
        '${JSON.stringify({
          account: wallets[2],
          externalId: "1120101",
          item: {
            tokenType: 2,
            token: erc721ContractLootSimpleAddress,
            tokenId: "1120101",
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
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
            },
          ],
        })}',
        null,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        102233151,
        '${erc721ContractLootSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[2],
          tokenId: "112010105",
        })}',
        102233150,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        102233152,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102233150,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
