// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@gemunion/contracts-misc/contracts/constants.sol";

import "../../Exchange/ExchangeUtils.sol";
import "./extensions/SignatureValidator.sol";
//import "../../Exchange/SignatureValidator.sol";
import "./interfaces/IERC721Ticket.sol";
import "../../utils/constants.sol";

// $$ PAYMANTS_SPLITTER
abstract contract LotteryRandom is ExchangeUtils, AccessControl, Pausable, SignatureValidator {
  using Address for address;
  using SafeERC20 for IERC20;

  Asset private _ticketAsset;
  Asset private _acceptedAsset;

  uint8 private _maxTicket = 2; // TODO change for 5000 in production or add to constructor
  uint256 private _timeLag = 2592; // TODO change in production: release after 2592000 seconds = 30 days or add to constructor
  uint8 internal comm = 30; // commission 30%
  event RoundStarted(uint256 round, uint256 startTimestamp);
  event RoundEnded(uint256 round, uint256 endTimestamp);
  event RoundFinalized(uint256 round, uint8[6] winValues);
  event Purchase(uint256 tokenId, address account, uint256 price, uint256 round, bool[36] numbers);
  event Released(uint256 round, uint256 amount);
  event Prize(address account, uint256 ticketId, uint256 amount);

  // LOTTERY

  struct Round {
    uint256 roundId;
    uint256 startTimestamp;
    uint256 endTimestamp;
    uint256 balance; // left after get prize
    uint256 total; // max money before
    Asset acceptedAsset;
    bool[][] tickets; // all round tickets
    uint8[6] values; // prize numbers
    uint8[7] aggregation; // prize counts
    uint256 requestId;
  }

  Round[] internal _rounds;

  // // TODO Exchange Lotter (price, ITEM)
  constructor(string memory name, Asset memory item, Asset memory price) SignatureValidator(name) {
    address account = _msgSender();
    _setupRole(DEFAULT_ADMIN_ROLE, account);
    _setupRole(PAUSER_ROLE, account);
    _setupRole(MINTER_ROLE, account);

    _ticketAsset = item;
    _acceptedAsset = price;
    // setTicketFactory(ticketFactory); // $$ TODO DELETE
    // setAcceptedToken(acceptedToken); // $$ TODO DELETE

    Round memory rootRound;
    rootRound.startTimestamp = block.timestamp;
    rootRound.endTimestamp = block.timestamp;
    _rounds.push(rootRound);
  }

  function setTicketFactory(Asset memory item) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(item.token.isContract(), "Lottery: the factory must be a deployed contract");
    _ticketAsset = item; // $$ ITEM(ASSET) insted of TicketFactoru
  }

  function setAcceptedToken(Asset memory price) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(price.token.isContract(), "Lottery: the factory must be a deployed contract");
    _acceptedAsset = price;
  }

  function startRound() public onlyRole(DEFAULT_ADMIN_ROLE) {
    Round memory prevRound = _rounds[_rounds.length - 1];
    require(prevRound.endTimestamp != 0, "Lottery: previous round is not yet finished");

    Round memory nextRound;
    _rounds.push(nextRound);

    uint256 roundNumber = _rounds.length - 1;

    Round storage currentRound = _rounds[roundNumber];
    currentRound.roundId = roundNumber;
    currentRound.acceptedAsset = _acceptedAsset;
    currentRound.startTimestamp = block.timestamp;

    emit RoundStarted(roundNumber, block.timestamp);
  }

  function getAllRounds() public view returns (Round[] memory) {
    return _rounds;
  }

  function getCurrentRound() public view returns (Round memory) {
    return _rounds[_rounds.length - 1];
  }

  function getRandomNumber() internal virtual returns (uint256 requestId);

  function endRound() external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];
    require(currentRound.roundId == roundNumber, "Lottery: wrong roundId");
    require(currentRound.endTimestamp == 0, "Lottery: previous round is already finished");

    currentRound.endTimestamp = block.timestamp;
    currentRound.requestId = getRandomNumber();

    uint256 commission = (currentRound.total * comm) / 100;
    currentRound.total -= commission;

    if (commission != 0) {
      Asset memory spendAsset = Asset(
        currentRound.acceptedAsset.tokenType,
        currentRound.acceptedAsset.token,
        currentRound.acceptedAsset.tokenId,
        commission
      );
      spend(toArray(spendAsset), _msgSender());
      // SafeERC20.safeTransfer(IERC20(_acceptedAsset.token), _msgSender(), commission);
    }

    emit RoundEnded(roundNumber, block.timestamp);
  }

  function releaseFunds(uint256 roundNumber) external onlyRole(DEFAULT_ADMIN_ROLE) {
    Round storage currentRound = _rounds[roundNumber];
    require(currentRound.endTimestamp + _timeLag < block.timestamp, "Round: is not releasable yet");
    require(currentRound.balance != 0, "Round: Nothing to Release");

    uint roundBalance = currentRound.balance;
    currentRound.balance = 0;

    spend(toArray(currentRound.acceptedAsset), _msgSender());
    // SafeERC20.safeTransfer(IERC20(_acceptedToken), _msgSender(), roundBalance);

    emit Released(roundNumber, roundBalance);
  }

  // ROUND

  function fulfillRandomWords(uint256, uint256[] memory randomWords) internal virtual {
    // may be storage
    Round storage currentRound = _rounds[_rounds.length - 1];

    // calculate wining numbers
    bool[36] memory tmp1;
    uint8 i = 0;
    while (i < 6) {
      uint256 number = randomWords[0] % 36;
      randomWords[0] = randomWords[0] / 37;
      if (!tmp1[number]) {
        currentRound.values[i] = uint8(number);
        tmp1[number] = true;
        i++;
      }
    }

    // aggregate data
    uint256 len = currentRound.tickets.length;
    for (uint8 l = 0; l < len; l++) {
      uint8 tmp2 = 0;
      for (uint8 j = 0; j < 6; j++) {
        if (currentRound.tickets[l][currentRound.values[j]]) {
          tmp2++;
        }
      }
      currentRound.aggregation[tmp2]++;
    }

    emit RoundFinalized(currentRound.roundId, currentRound.values);
  }

  // MARKETPLACE

  function purchase(
    Params memory params,
    bool[36] calldata numbers,
    Asset memory price,
    bytes calldata signature
  ) external whenNotPaused {
    // ! TODO returning incorrect signer.
    // address signer = _verifySignature(params, numbers, price, signature);
    // console.log("SIGNER",signer);
    // require(hasRole(MINTER_ROLE, signer), "Lottery: Wrong signer");

    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];

    require(currentRound.endTimestamp == 0, "Lottery: current round is finished");

    require(currentRound.tickets.length < _maxTicket, "Lottery: no more tickets available");
    currentRound.tickets.push(numbers);

    address account = _msgSender();

    currentRound.balance += price.amount;
    currentRound.total += price.amount;

    spendFrom(toArray(price), _msgSender(), address(this));
    // SafeERC20.safeTransferFrom(IERC20(_acceptedAsset.token), _msgSender(), address(this), price);

    uint256 tokenId = IERC721Ticket(_ticketAsset.token).mintTicket(account, roundNumber, numbers);

    emit Purchase(tokenId, account, price.amount, roundNumber, numbers);
  }

  function getPrize(uint256 tokenId) external {
    IERC721Ticket ticketFactory = IERC721Ticket(_ticketAsset.token);

    Ticket memory data = ticketFactory.getTicketData(tokenId);

    ticketFactory.burn(tokenId);

    uint8[] memory coefficient = new uint8[](7);
    coefficient[0] = 0;
    coefficient[1] = 15;
    coefficient[2] = 50;
    coefficient[3] = 70;
    coefficient[4] = 110;
    coefficient[5] = 140;
    coefficient[6] = 220;

    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];

    uint8[7] memory aggregation = currentRound.aggregation;

    uint256 sumc;
    for (uint8 l = 0; l < 7; l++) {
      uint256 ag = aggregation[l];
      uint256 co = coefficient[l];
      sumc = sumc + (ag * co);
    }

    uint256 point = currentRound.total / sumc;

    uint8 result = 0;
    for (uint8 j = 0; j < 6; j++) {
      if (data.numbers[currentRound.values[j]]) {
        result++;
      }
    }

    uint256 amount = point * coefficient[result];
    currentRound.balance -= amount;

    Asset[] memory price = new Asset[](1);
    price[0] = Asset(
      currentRound.acceptedAsset.tokenType, // _acceptedAsset.tokenType,
      currentRound.acceptedAsset.token, // _acceptedAsset.token,
      currentRound.acceptedAsset.tokenId, // _acceptedAsset.tokenId,
      amount
    );

    spend(price, _msgSender());

    emit Prize(_msgSender(), tokenId, amount);
  }

  // PAUSABLE

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  // COMMON

  receive() external payable {
    revert();
  }
}
