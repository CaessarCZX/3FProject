/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    FFFBusiness: {
      address: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "oldBusinessWallet",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newBusinessWallet",
              type: "address",
            },
          ],
          name: "BusinessWalletSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Deposit",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "member",
              type: "address",
            },
          ],
          name: "NewMember",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "member",
              type: "address",
            },
            {
              indexed: false,
              internalType: "string",
              name: "rank",
              type: "string",
            },
          ],
          name: "NewRankReached",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Refund",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "WithdrawalRequest",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_to",
              type: "address",
            },
            {
              internalType: "address",
              name: "_from",
              type: "address",
            },
          ],
          name: "addReferralToUpline",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_newBusinessWallet",
              type: "address",
            },
          ],
          name: "changeBusinessWallet",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "deposit",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "depositMemeberFunds",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "getBusinessWallet",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_currentMember",
              type: "address",
            },
          ],
          name: "getMemberBalance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_memberAddress",
              type: "address",
            },
          ],
          name: "getMemberDetails",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "enum FFFBusiness.Ranks",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "address payable",
                  name: "memberWallet",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "isActive",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "balance",
                  type: "uint256",
                },
                {
                  internalType: "enum FFFBusiness.Ranks",
                  name: "rank",
                  type: "uint8",
                },
              ],
              internalType: "struct FFFBusiness.Member",
              name: "member",
              type: "tuple",
            },
          ],
          name: "getMemberDetails",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "enum FFFBusiness.Ranks",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [],
          name: "getTotalActiveMembers",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_currentMember",
              type: "address",
            },
          ],
          name: "getTotalAffiliatesPerMember",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getTotalMembers",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_currentMember",
              type: "address",
            },
          ],
          name: "isCurrentlyActiveUser",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_uplineAddress",
              type: "address",
            },
          ],
          name: "memberEntrance",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_memberAddress",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
          ],
          name: "payToMember",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint128",
              name: "_requestedAmount",
              type: "uint128",
            },
          ],
          name: "withdrawalRequest",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
  },
  11155111: {
    FFFBusiness: {
      address: "0xa076ECA5a4751496AC055Eb31151DAE50cA9EB79",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_mainWallet",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "oldBusinessWallet",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newBusinessWallet",
              type: "address",
            },
          ],
          name: "BusinessWalletSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Deposit",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "member",
              type: "address",
            },
          ],
          name: "NewMember",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "member",
              type: "address",
            },
            {
              indexed: false,
              internalType: "string",
              name: "rank",
              type: "string",
            },
          ],
          name: "NewRankReached",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Refund",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "WithdrawalRequest",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_to",
              type: "address",
            },
            {
              internalType: "address",
              name: "_from",
              type: "address",
            },
          ],
          name: "addReferralToUpline",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_newBusinessWallet",
              type: "address",
            },
          ],
          name: "changeBusinessWallet",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "deposit",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "depositMemeberFunds",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "getBusinessWallet",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_currentMember",
              type: "address",
            },
          ],
          name: "getMemberBalance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_memberAddress",
              type: "address",
            },
          ],
          name: "getMemberDetails",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "enum FFFBusiness.Ranks",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "address payable",
                  name: "memberWallet",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "isActive",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "balance",
                  type: "uint256",
                },
                {
                  internalType: "enum FFFBusiness.Ranks",
                  name: "rank",
                  type: "uint8",
                },
              ],
              internalType: "struct FFFBusiness.Member",
              name: "member",
              type: "tuple",
            },
          ],
          name: "getMemberDetails",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "enum FFFBusiness.Ranks",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [],
          name: "getTotalActiveMembers",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getTotalMembers",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "isCurrentlyActiveUser",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_uplineAddress",
              type: "address",
            },
          ],
          name: "memberEntrance",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_memberAddress",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
          ],
          name: "payToMember",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint128",
              name: "_requestedAmount",
              type: "uint128",
            },
          ],
          name: "withdrawalRequest",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
