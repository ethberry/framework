import { BigNumber, constants, utils } from "ethers";

export const baseTokenURI = "http://localhost:3011/metadata"; // no trailing slash
export const tokenSymbol = "SYMBOL";
export const tokenName = "Lorem ipsum...";
export const tokenId = 1;
export const templateId = 1;
export const royalty = 100;

export const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const METADATA_ADMIN_ROLE = utils.id("METADATA_ADMIN_ROLE");
export const MINTER_ROLE = utils.id("MINTER_ROLE");
export const PAUSER_ROLE = utils.id("PAUSER_ROLE");
export const SNAPSHOT_ROLE = utils.id("SNAPSHOT_ROLE");

export const decimals = BigNumber.from(10).pow(18);
export const amount = 10000;
export const period = 60 * 60 * 24 * 365; // a year in seconds
export const _stakePeriod = 300; // 5 minutes in seconds

export const nonce = utils.formatBytes32String("nonce1");

// INTERFACES
export const accessControlInterfaceId = "0x7965db0b";

// CHAINLINK
// Hardhat addresses
export const LINK_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const VRF_ADDR = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// LINK_ADDR=0x5FbDB2315678afecb367f032d93F642f64180aa3
// VRF_ADDR=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
// LINK_ADDR=0x8D81A3DCd17030cD5F23Ac7370e4Efb10D2b3cA4
// VRF_ADDR=0xa722bdA6968F50778B973Ae2701e90200C564B49

// EXCHANGE
export const externalId = 123;
export const expiresAt = 0;

export const params = {
  nonce,
  externalId,
  expiresAt,
  referrer: constants.AddressZero,
};

export const featureIds = [1, 3];

export const bytecode721 =
  "0x60806040523480156200001157600080fd5b5060405162003f4938038062003f49833981016040819052620000349162000445565b838383838383838380848484808383818181600390805190602001906200005d929190620002d2565b50805162000073906004906020840190620002d2565b506200008591506000905033620000ff565b620000b17f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633620000ff565b50620000c0905033826200010f565b50505050620000d5816200021460201b60201c565b50620000ed600d6200022960201b620018951760201c565b50505050505050505050505062000535565b6200010b828262000232565b5050565b6127106001600160601b0382161115620001835760405162461bcd60e51b815260206004820152602a60248201527f455243323938313a20726f79616c7479206665652077696c6c206578636565646044820152692073616c65507269636560b01b60648201526084015b60405180910390fd5b6001600160a01b038216620001db5760405162461bcd60e51b815260206004820152601960248201527f455243323938313a20696e76616c69642072656365697665720000000000000060448201526064016200017a565b604080518082019091526001600160a01b039092168083526001600160601b039091166020909201829052600160a01b90910217600155565b80516200010b90600e906020840190620002d2565b80546001019055565b6000828152602081815260408083206001600160a01b038516845290915290205460ff166200010b576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556200028e3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b828054620002e090620004f8565b90600052602060002090601f0160209004810192826200030457600085556200034f565b82601f106200031f57805160ff19168380011785556200034f565b828001600101855582156200034f579182015b828111156200034f57825182559160200191906001019062000332565b506200035d92915062000361565b5090565b5b808211156200035d576000815560010162000362565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620003a057600080fd5b81516001600160401b0380821115620003bd57620003bd62000378565b604051601f8301601f19908116603f01168101908282118183101715620003e857620003e862000378565b816040528381526020925086838588010111156200040557600080fd5b600091505b838210156200042957858201830151818301840152908201906200040a565b838211156200043b5760008385830101525b9695505050505050565b600080600080608085870312156200045c57600080fd5b84516001600160401b03808211156200047457600080fd5b62000482888389016200038e565b955060208701519150808211156200049957600080fd5b620004a7888389016200038e565b604088015190955091506001600160601b0382168214620004c757600080fd5b606087015191935080821115620004dd57600080fd5b50620004ec878288016200038e565b91505092959194509250565b600181811c908216806200050d57607f821691505b602082108114156200052f57634e487b7160e01b600052602260045260246000fd5b50919050565b613a0480620005456000396000f3fe6080604052600436106103015760003560e01c806355f804b31161018f578063a22cb465116100e1578063d5a3106f1161008a578063f9f92be411610064578063f9f92be41461094c578063fdbf62211461096c578063fe575a871461098c57600080fd5b8063d5a3106f146108c3578063ddd4e853146108e3578063e985e9c51461090357600080fd5b8063ca267f28116100bb578063ca267f281461085a578063d53913931461086f578063d547741f146108a357600080fd5b8063a22cb465146107fa578063b88d4fde1461081a578063c87b56dd1461083a57600080fd5b806370a082311161014357806391d148541161011d57806391d148541461078c57806395d89b41146107d0578063a217fddf146107e557600080fd5b806370a082311461071857806387eb502e1461073857806390c280ff1461076c57600080fd5b8063603168011161017457806360316801146106cb5780636352211e146106f85780636a6278421461059757600080fd5b806355f804b31461068b5780635944c753146106ab57600080fd5b8063274eafa51161025357806341e825d6116101fc57806342d4817c116101d657806342d4817c1461061757806345977d031461064b5780634f6ccce71461066b57600080fd5b806341e825d6146105b757806342842e0e146105d757806342966c68146105f757600080fd5b80632f745c591161022d5780632f745c591461055757806336568abe1461057757806340d097c31461059757600080fd5b8063274eafa5146104d85780632a55205a146104f85780632f2ff15d1461053757600080fd5b806318160ddd116102b55780631cb5d5ff1161028f5780631cb5d5ff1461045457806323b872dd14610488578063248a9ca3146104a857600080fd5b806318160ddd146103e157806319c1f93c146104005780631a8952661461043457600080fd5b806306fdde03116102e657806306fdde0314610367578063081812fc14610389578063095ea7b3146103c157600080fd5b806301ffc9a71461031057806304634d8d1461034557600080fd5b3661030b57600080fd5b600080fd5b34801561031c57600080fd5b5061033061032b3660046131c1565b6109c5565b60405190151581526020015b60405180910390f35b34801561035157600080fd5b50610365610360366004613216565b6109d6565b005b34801561037357600080fd5b5061037c610a3f565b60405161033c91906132a1565b34801561039557600080fd5b506103a96103a43660046132b4565b610ad1565b6040516001600160a01b03909116815260200161033c565b3480156103cd57600080fd5b506103656103dc3660046132cd565b610af8565b3480156103ed57600080fd5b50600b545b60405190815260200161033c565b34801561040c57600080fd5b506103f27fe02a0315b383857ac496e9d2b2546a699afaeb4e5e83a1fdef64376d0b74e5a581565b34801561044057600080fd5b5061036561044f3660046132f7565b610c2f565b34801561046057600080fd5b506103f27f08e1ec9b1b54002f93fd04c8195a36be67f2b6b212f18cc951984bc2411b08ee81565b34801561049457600080fd5b506103656104a3366004613312565b610c84565b3480156104b457600080fd5b506103f26104c33660046132b4565b60009081526020819052604090206001015490565b3480156104e457600080fd5b506103306104f33660046132b4565b610cfd565b34801561050457600080fd5b5061051861051336600461334e565b610d49565b604080516001600160a01b03909316835260208301919091520161033c565b34801561054357600080fd5b50610365610552366004613370565b610e04565b34801561056357600080fd5b506103f26105723660046132cd565b610e29565b34801561058357600080fd5b50610365610592366004613370565b610ed1565b3480156105a357600080fd5b506103656105b23660046132f7565b610f5d565b3480156105c357600080fd5b506103f26105d236600461334e565b610fcb565b3480156105e357600080fd5b506103656105f2366004613312565b611041565b34801561060357600080fd5b506103656106123660046132b4565b61105c565b34801561062357600080fd5b506103f27f29daa7827568eaaa01af346b3b05934ea63f4e23858c064cc599d07420ce3a7381565b34801561065757600080fd5b506103306106663660046132b4565b6110d4565b34801561067757600080fd5b506103f26106863660046132b4565b6111c6565b34801561069757600080fd5b506103656106a636600461345b565b61126a565b3480156106b757600080fd5b506103656106c63660046134a4565b61127e565b3480156106d757600080fd5b506106eb6106e63660046132b4565b6112ef565b60405161033c91906134e0565b34801561070457600080fd5b506103a96107133660046132b4565b61140d565b34801561072457600080fd5b506103f26107333660046132f7565b611472565b34801561074457600080fd5b506103f27f9319bf1fd23873eaf43c06bb91a1db3e678411d693e959f1512879196908f12c81565b34801561077857600080fd5b506103f26107873660046132b4565b61150c565b34801561079857600080fd5b506103306107a7366004613370565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b3480156107dc57600080fd5b5061037c611579565b3480156107f157600080fd5b506103f2600081565b34801561080657600080fd5b5061036561081536600461353d565b611588565b34801561082657600080fd5b50610365610835366004613574565b611593565b34801561084657600080fd5b5061037c6108553660046132b4565b611612565b34801561086657600080fd5b506010546103f2565b34801561087b57600080fd5b506103f27f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b3480156108af57600080fd5b506103656108be366004613370565b611679565b3480156108cf57600080fd5b506103306108de36600461334e565b61169e565b3480156108ef57600080fd5b506103656108fe3660046135f0565b611714565b34801561090f57600080fd5b5061033061091e3660046136c8565b6001600160a01b03918216600090815260086020908152604080832093909416825291909152205460ff1690565b34801561095857600080fd5b506103656109673660046132f7565b611748565b34801561097857600080fd5b506103656109873660046132cd565b6117a0565b34801561099857600080fd5b506103306109a73660046132f7565b6001600160a01b031660009081526011602052604090205460ff1690565b60006109d08261189e565b92915050565b60006109e1816118dc565b6109eb83836118e6565b604080516001600160a01b03851681526bffffffffffffffffffffffff841660208201527f0e00be276219671425236169cbe1adf9f210e58048dba5536294f9423dc2bbc3910160405180910390a1505050565b606060038054610a4e906136f2565b80601f0160208091040260200160405190810160405280929190818152602001828054610a7a906136f2565b8015610ac75780601f10610a9c57610100808354040283529160200191610ac7565b820191906000526020600020905b815481529060010190602001808311610aaa57829003601f168201915b5050505050905090565b6000610adc826119ed565b506000908152600760205260409020546001600160a01b031690565b6000610b038261140d565b9050806001600160a01b0316836001600160a01b03161415610b925760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560448201527f720000000000000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b336001600160a01b0382161480610bae5750610bae813361091e565b610c205760405162461bcd60e51b815260206004820152603e60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206e6f7220617070726f76656420666f7220616c6c00006064820152608401610b89565b610c2a8383611a51565b505050565b6000610c3a816118dc565b6001600160a01b038216600081815260116020526040808220805460ff19169055517f117e3210bb9aa7d9baff172026820255c6f6c30ba8999d1c2fd88e2848137c4e9190a25050565b610c8f335b82611acc565b610cf25760405162461bcd60e51b815260206004820152602e60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201526d1c881b9bdc88185c1c1c9bdd995960921b6064820152608401610b89565b610c2a838383611b4b565b601054600090610d0f57506000919050565b6000828152600f6020526040902060020154601080548492908110610d3657610d36613727565b9060005260206000200154149050919050565b60008281526002602090815260408083208151808301909252546001600160a01b038116808352600160a01b9091046bffffffffffffffffffffffff16928201929092528291610dc85750604080518082019091526001546001600160a01b0381168252600160a01b90046bffffffffffffffffffffffff1660208201525b602081015160009061271090610dec906bffffffffffffffffffffffff1687613753565b610df69190613788565b915196919550909350505050565b600082815260208190526040902060010154610e1f816118dc565b610c2a8383611d30565b6000610e3483611472565b8210610ea85760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201527f74206f6620626f756e64730000000000000000000000000000000000000000006064820152608401610b89565b506001600160a01b03919091166000908152600960209081526040808320938352929052205490565b6001600160a01b0381163314610f4f5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c6600000000000000000000000000000000006064820152608401610b89565b610f598282611dce565b5050565b60405162461bcd60e51b815260206004820152602a60248201527f45524337323153696d706c653a2074686973206d6574686f64206973206e6f7460448201527f20737570706f72746564000000000000000000000000000000000000000000006064820152608401610b89565b6000610fd7838361169e565b6110235760405162461bcd60e51b815260206004820152601360248201527f47433a206669656c64206e6f7420666f756e64000000000000000000000000006044820152606401610b89565b506000918252600f6020908152604080842092845291905290205490565b610c2a83838360405180602001604052806000815250611593565b61106533610c89565b6110c85760405162461bcd60e51b815260206004820152602e60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201526d1c881b9bdc88185c1c1c9bdd995960921b6064820152608401610b89565b6110d181611e4d565b50565b60007f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6611100816118dc565b600061112c847f08e1ec9b1b54002f93fd04c8195a36be67f2b6b212f18cc951984bc2411b08ee610fcb565b9050611163847f08e1ec9b1b54002f93fd04c8195a36be67f2b6b212f18cc951984bc2411b08ee61115e84600161379c565b611e56565b507feec61667dd6eeecdccfef3c906e0fd047cca672804901ac4254d8545e9a426d4338561119284600161379c565b604080516001600160a01b03909416845260208401929092529082015260600160405180910390a160019250505b50919050565b60006111d1600b5490565b82106112455760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201527f7574206f6620626f756e647300000000000000000000000000000000000000006064820152608401610b89565b600b828154811061125857611258613727565b90600052602060002001549050919050565b6000611275816118dc565b610f5982611eaa565b6000611289816118dc565b611294848484611ebd565b604080518581526001600160a01b03851660208201526bffffffffffffffffffffffff84168183015290517f298accd521f9750586b5499be3cfaacadc0d60031f4cf81289328cb824905b229181900360600190a150505050565b6000818152600f60205260408120600101546060918167ffffffffffffffff81111561131d5761131d613393565b60405190808252806020026020018201604052801561136257816020015b604080518082019091526000808252602082015281526020019060019003908161133b5790505b50905060005b828160ff161015611405576000858152600f60205260408120600101805460ff841690811061139957611399613727565b60009182526020808320909101546040805180820182528281528a8552600f84528185208386528452932054918301919091528451909250849060ff85169081106113e6576113e6613727565b60200260200101819052505080806113fd906137b4565b915050611368565b509392505050565b6000818152600560205260408120546001600160a01b0316806109d05760405162461bcd60e51b815260206004820152601860248201527f4552433732313a20696e76616c696420746f6b656e20494400000000000000006044820152606401610b89565b60006001600160a01b0382166114f05760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f74206120766160448201527f6c6964206f776e657200000000000000000000000000000000000000000000006064820152608401610b89565b506001600160a01b031660009081526006602052604090205490565b600061151782610cfd565b6115635760405162461bcd60e51b815260206004820152601460248201527f47433a207265636f7264206e6f7420666f756e640000000000000000000000006044820152606401610b89565b506000908152600f602052604090206001015490565b606060048054610a4e906136f2565b610f59338383611fd5565b61159d3383611acc565b6116005760405162461bcd60e51b815260206004820152602e60248201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560448201526d1c881b9bdc88185c1c1c9bdd995960921b6064820152608401610b89565b61160c848484846120a4565b50505050565b606061161d826119ed565b6000611627612122565b905060008151116116475760405180602001604052806000815250611672565b80611651846121bc565b6040516020016116629291906137d4565b6040516020818303038152906040525b9392505050565b600082815260208190526040902060010154611694816118dc565b610c2a8383611dce565b60006116a983610cfd565b6116b5575060006109d0565b6116be8361150c565b6116ca575060006109d0565b6000838152600f602090815260408083208584529182905290912060019081015491018054849290811061170057611700613727565b906000526020600020015414905092915050565b7fe02a0315b383857ac496e9d2b2546a699afaeb4e5e83a1fdef64376d0b74e5a561173e816118dc565b610c2a83836122ba565b6000611753816118dc565b6001600160a01b038216600081815260116020526040808220805460ff19166001179055517fffa4e6181777692565cf28528fc88fd1516ea86b56da075235fa575af6a4b8559190a25050565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a66117ca816118dc565b816118175760405162461bcd60e51b815260206004820152601d60248201527f4552433732315570677261646561626c653a2077726f6e6720747970650000006044820152606401610b89565b6000611822600d5490565b9050611832600d80546001019055565b61185d817f9319bf1fd23873eaf43c06bb91a1db3e678411d693e959f1512879196908f12c85611e56565b5061188a817f08e1ec9b1b54002f93fd04c8195a36be67f2b6b212f18cc951984bc2411b08ee6001611e56565b5061160c8482612328565b80546001019055565b60006001600160e01b031982167f45977d030000000000000000000000000000000000000000000000000000000014806109d057506109d082612342565b6110d1813361234d565b6127106bffffffffffffffffffffffff821611156119595760405162461bcd60e51b815260206004820152602a60248201527f455243323938313a20726f79616c7479206665652077696c6c206578636565646044820152692073616c65507269636560b01b6064820152608401610b89565b6001600160a01b0382166119af5760405162461bcd60e51b815260206004820152601960248201527f455243323938313a20696e76616c6964207265636569766572000000000000006044820152606401610b89565b604080518082019091526001600160a01b039092168083526bffffffffffffffffffffffff9091166020909201829052600160a01b90910217600155565b6000818152600560205260409020546001600160a01b03166110d15760405162461bcd60e51b815260206004820152601860248201527f4552433732313a20696e76616c696420746f6b656e20494400000000000000006044820152606401610b89565b6000818152600760205260409020805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0384169081179091558190611a938261140d565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080611ad88361140d565b9050806001600160a01b0316846001600160a01b03161480611b1f57506001600160a01b0380821660009081526008602090815260408083209388168352929052205460ff165b80611b435750836001600160a01b0316611b3884610ad1565b6001600160a01b0316145b949350505050565b826001600160a01b0316611b5e8261140d565b6001600160a01b031614611bda5760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201527f6f776e65720000000000000000000000000000000000000000000000000000006064820152608401610b89565b6001600160a01b038216611c555760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152608401610b89565b611c608383836123cb565b611c6b600082611a51565b6001600160a01b0383166000908152600660205260408120805460019290611c94908490613803565b90915550506001600160a01b0382166000908152600660205260408120805460019290611cc290849061379c565b9091555050600081815260056020526040808220805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16610f59576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055611d8a3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff1615610f59576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6110d181612584565b6000611e6184610cfd565b611e7057611e6e8461259e565b505b611e7a848461169e565b611e8a57611e888484612655565b505b506000928352600f60209081526040808520938552929052912055600190565b8051610f5990600e906020840190613112565b6127106bffffffffffffffffffffffff82161115611f305760405162461bcd60e51b815260206004820152602a60248201527f455243323938313a20726f79616c7479206665652077696c6c206578636565646044820152692073616c65507269636560b01b6064820152608401610b89565b6001600160a01b038216611f865760405162461bcd60e51b815260206004820152601b60248201527f455243323938313a20496e76616c696420706172616d657465727300000000006044820152606401610b89565b6040805180820182526001600160a01b0393841681526bffffffffffffffffffffffff92831660208083019182526000968752600290529190942093519051909116600160a01b029116179055565b816001600160a01b0316836001600160a01b031614156120375760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610b89565b6001600160a01b03838116600081815260086020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6120af848484611b4b565b6120bb84848484612763565b61160c5760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b6064820152608401610b89565b60606121b7600e8054612134906136f2565b80601f0160208091040260200160405190810160405280929190818152602001828054612160906136f2565b80156121ad5780601f10612182576101008083540402835291602001916121ad565b820191906000526020600020905b81548152906001019060200180831161219057829003601f168201915b50505050506128bb565b905090565b6060816121e05750506040805180820190915260018152600360fc1b602082015290565b8160005b811561220a57806121f48161381a565b91506122039050600a83613788565b91506121e4565b60008167ffffffffffffffff81111561222557612225613393565b6040519080825280601f01601f19166020018201604052801561224f576020820181803683370190505b5090505b8415611b4357612264600183613803565b9150612271600a86613835565b61227c90603061379c565b60f81b81838151811061229157612291613727565b60200101906001600160f81b031916908160001a9053506122b3600a86613788565b9450612253565b805160005b818160ff16101561160c5761231584848360ff16815181106122e3576122e3613727565b602002602001015160000151858460ff168151811061230457612304613727565b602002602001015160200151611e56565b5080612320816137b4565b9150506122bf565b610f598282604051806020016040528060008152506128f0565b60006109d08261296e565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16610f5957612389816001600160a01b03166014612979565b612394836020612979565b6040516020016123a5929190613849565b60408051601f198184030181529082905262461bcd60e51b8252610b89916004016132a1565b60405163fe575a8760e01b81526001600160a01b0384166004820152309063fe575a879060240160206040518083038186803b15801561240a57600080fd5b505afa15801561241e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061244291906138ca565b1561248f5760405162461bcd60e51b815260206004820181905260248201527f426c61636b6c6973743a2073656e64657220697320626c61636b6c69737465646044820152606401610b89565b60405163fe575a8760e01b81526001600160a01b0383166004820152309063fe575a879060240160206040518083038186803b1580156124ce57600080fd5b505afa1580156124e2573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061250691906138ca565b156125795760405162461bcd60e51b815260206004820152602260248201527f426c61636b6c6973743a20726563656976657220697320626c61636b6c69737460448201527f65640000000000000000000000000000000000000000000000000000000000006064820152608401610b89565b610c2a838383612b3e565b61258d81612b49565b600090815260026020526040812055565b60006125a982610cfd565b156125f65760405162461bcd60e51b815260206004820152601960248201527f47433a207265636f726420616c726561647920657869737473000000000000006044820152606401610b89565b601080546001818101835560008390527f1b6847dc741a1b0cd08d278845f9d819d87b734759afb55fe2de5cb82a9ae67290910184905590546126399190613803565b6000928352600f60205260409092206002019190915550600190565b600061266083610cfd565b6126ac5760405162461bcd60e51b815260206004820152601460248201527f47433a207265636f7264206e6f7420666f756e640000000000000000000000006044820152606401610b89565b6126b6838361169e565b156127035760405162461bcd60e51b815260206004820152601560248201527f47433a206669656c6420616c72656164792073657400000000000000000000006044820152606401610b89565b6000838152600f602090815260408220600190810180548083018255818552928420909201859055918590525461273a9190613803565b6000938452600f6020908152604080862094865293905291909220600190810191909155919050565b60006001600160a01b0384163b156128b057604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906127a79033908990889088906004016138e7565b602060405180830381600087803b1580156127c157600080fd5b505af19250505080156127f1575060408051601f3d908101601f191682019092526127ee91810190613923565b60015b612896573d80801561281f576040519150601f19603f3d011682016040523d82523d6000602084013e612824565b606091505b50805161288e5760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b6064820152608401610b89565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050611b43565b506001949350505050565b6060816128c9306014612979565b6040516020016128da929190613940565b6040516020818303038152906040529050919050565b6128fa8383612bfd565b6129076000848484612763565b610c2a5760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b6064820152608401610b89565b60006109d082612d58565b60606000612988836002613753565b61299390600261379c565b67ffffffffffffffff8111156129ab576129ab613393565b6040519080825280601f01601f1916602001820160405280156129d5576020820181803683370190505b509050600360fc1b816000815181106129f0576129f0613727565b60200101906001600160f81b031916908160001a9053507f780000000000000000000000000000000000000000000000000000000000000081600181518110612a3b57612a3b613727565b60200101906001600160f81b031916908160001a9053506000612a5f846002613753565b612a6a90600161379c565b90505b6001811115612aef577f303132333435363738396162636465660000000000000000000000000000000085600f1660108110612aab57612aab613727565b1a60f81b828281518110612ac157612ac1613727565b60200101906001600160f81b031916908160001a90535060049490941c93612ae8816139a1565b9050612a6d565b5083156116725760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610b89565b610c2a838383612d63565b6000612b548261140d565b9050612b62816000846123cb565b612b6d600083611a51565b6001600160a01b0381166000908152600660205260408120805460019290612b96908490613803565b9091555050600082815260056020526040808220805473ffffffffffffffffffffffffffffffffffffffff19169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6001600160a01b038216612c535760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610b89565b6000818152600560205260409020546001600160a01b031615612cb85760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610b89565b612cc4600083836123cb565b6001600160a01b0382166000908152600660205260408120805460019290612ced90849061379c565b9091555050600081815260056020526040808220805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b60006109d082612d6e565b610c2a838383612d79565b60006109d082612e31565b6001600160a01b038316612dd457612dcf81600b80546000838152600c60205260408120829055600182018355919091527f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db90155565b612df7565b816001600160a01b0316836001600160a01b031614612df757612df78382612e3c565b6001600160a01b038216612e0e57610c2a81612ed9565b826001600160a01b0316826001600160a01b031614610c2a57610c2a8282612f88565b60006109d082612fcc565b60006001612e4984611472565b612e539190613803565b6000838152600a6020526040902054909150808214612ea6576001600160a01b03841660009081526009602090815260408083208584528252808320548484528184208190558352600a90915290208190555b506000918252600a602090815260408084208490556001600160a01b039094168352600981528383209183525290812055565b600b54600090612eeb90600190613803565b6000838152600c6020526040812054600b8054939450909284908110612f1357612f13613727565b9060005260206000200154905080600b8381548110612f3457612f34613727565b6000918252602080832090910192909255828152600c9091526040808220849055858252812055600b805480612f6c57612f6c6139b8565b6001900381819060005260206000200160009055905550505050565b6000612f9383611472565b6001600160a01b0390931660009081526009602090815260408083208684528252808320859055938252600a9052919091209190915550565b60006001600160e01b031982167f780e9d630000000000000000000000000000000000000000000000000000000014806109d057506109d08260006001600160e01b031982167f80ac58cd00000000000000000000000000000000000000000000000000000000148061306857506001600160e01b031982167f5b5e139f00000000000000000000000000000000000000000000000000000000145b806109d057506109d08260006001600160e01b031982167f2a55205a0000000000000000000000000000000000000000000000000000000014806109d057506109d08260006001600160e01b031982167f7965db0b0000000000000000000000000000000000000000000000000000000014806109d057507f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b03198316146109d0565b82805461311e906136f2565b90600052602060002090601f0160209004810192826131405760008555613186565b82601f1061315957805160ff1916838001178555613186565b82800160010185558215613186579182015b8281111561318657825182559160200191906001019061316b565b50613192929150613196565b5090565b5b808211156131925760008155600101613197565b6001600160e01b0319811681146110d157600080fd5b6000602082840312156131d357600080fd5b8135611672816131ab565b80356001600160a01b03811681146131f557600080fd5b919050565b80356bffffffffffffffffffffffff811681146131f557600080fd5b6000806040838503121561322957600080fd5b613232836131de565b9150613240602084016131fa565b90509250929050565b60005b8381101561326457818101518382015260200161324c565b8381111561160c5750506000910152565b6000815180845261328d816020860160208601613249565b601f01601f19169290920160200192915050565b6020815260006116726020830184613275565b6000602082840312156132c657600080fd5b5035919050565b600080604083850312156132e057600080fd5b6132e9836131de565b946020939093013593505050565b60006020828403121561330957600080fd5b611672826131de565b60008060006060848603121561332757600080fd5b613330846131de565b925061333e602085016131de565b9150604084013590509250925092565b6000806040838503121561336157600080fd5b50508035926020909101359150565b6000806040838503121561338357600080fd5b82359150613240602084016131de565b634e487b7160e01b600052604160045260246000fd5b6040805190810167ffffffffffffffff811182821017156133cc576133cc613393565b60405290565b604051601f8201601f1916810167ffffffffffffffff811182821017156133fb576133fb613393565b604052919050565b600067ffffffffffffffff83111561341d5761341d613393565b613430601f8401601f19166020016133d2565b905082815283838301111561344457600080fd5b828260208301376000602084830101529392505050565b60006020828403121561346d57600080fd5b813567ffffffffffffffff81111561348457600080fd5b8201601f8101841361349557600080fd5b611b4384823560208401613403565b6000806000606084860312156134b957600080fd5b833592506134c9602085016131de565b91506134d7604085016131fa565b90509250925092565b602080825282518282018190526000919060409081850190868401855b82811015613522578151805185528601518685015292840192908501906001016134fd565b5091979650505050505050565b80151581146110d157600080fd5b6000806040838503121561355057600080fd5b613559836131de565b915060208301356135698161352f565b809150509250929050565b6000806000806080858703121561358a57600080fd5b613593856131de565b93506135a1602086016131de565b925060408501359150606085013567ffffffffffffffff8111156135c457600080fd5b8501601f810187136135d557600080fd5b6135e487823560208401613403565b91505092959194509250565b600080604080848603121561360457600080fd5b8335925060208085013567ffffffffffffffff8082111561362457600080fd5b818701915087601f83011261363857600080fd5b81358181111561364a5761364a613393565b613658848260051b016133d2565b818152848101925060069190911b83018401908982111561367857600080fd5b928401925b818410156136b85785848b0312156136955760008081fd5b61369d6133a9565b8435815285850135868201528352928501929184019161367d565b8096505050505050509250929050565b600080604083850312156136db57600080fd5b6136e4836131de565b9150613240602084016131de565b600181811c9082168061370657607f821691505b602082108114156111c057634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600081600019048311821515161561376d5761376d61373d565b500290565b634e487b7160e01b600052601260045260246000fd5b60008261379757613797613772565b500490565b600082198211156137af576137af61373d565b500190565b600060ff821660ff8114156137cb576137cb61373d565b60010192915050565b600083516137e6818460208801613249565b8351908301906137fa818360208801613249565b01949350505050565b6000828210156138155761381561373d565b500390565b600060001982141561382e5761382e61373d565b5060010190565b60008261384457613844613772565b500690565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351613881816017850160208801613249565b7f206973206d697373696e6720726f6c652000000000000000000000000000000060179184019182015283516138be816028840160208801613249565b01602801949350505050565b6000602082840312156138dc57600080fd5b81516116728161352f565b60006001600160a01b038087168352808616602084015250836040830152608060608301526139196080830184613275565b9695505050505050565b60006020828403121561393557600080fd5b8151611672816131ab565b60008351613952818460208801613249565b80830190507f2f00000000000000000000000000000000000000000000000000000000000000808252845161398e816001850160208901613249565b6001920191820152600201949350505050565b6000816139b0576139b061373d565b506000190190565b634e487b7160e01b600052603160045260246000fdfea26469706673582212202244703de450419a3c6daea43c2730b238e2ffa7fe81d4294f79faeddf871ce164736f6c63430008090033";
