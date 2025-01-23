/**
 * Invalid address for contract
 */
export const INVALID_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 *  Secret key for enable exclusive functions for members
 */
export const MEMBERS_INVITATION_KEY = process.env.NEXT_PUBLIC_INVITATION_MEMBERS_KEY ?? "0x0"; // Production

/**
 * Test net contract address
 */
export const TESTNET_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TESTNET_CONTRACT ?? "0x0";

/**
 * Token addresses for dev or production
 */
export const TESTNET_USDT_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TEST_TOKEN_ADDRESS_USDT3F ?? "0x0";
export const USDT_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_USDT_TOKEN ?? "0x0";
/**
 * To change address for production or development
 */
export const GET_KEYS_IN = {
  PRODUCTION: true,
  DEVELOPMENT: false,
};
