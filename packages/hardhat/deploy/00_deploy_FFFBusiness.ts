import { Contract } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// For development use only
// const USDT_TOKEN_TEST = process.env.TEST_TOKEN_ADDRESS_FUSDT;

// USDT TETHER CONTRACT ADDRES FOR TRANSACTIONS IN SMART CONTRACT
const USDT_TETHER = process.env.USDT_TETHER;

// DEVELOPMENT KEY USE
const MEMBERS_KEY = process.env.INVITATION_MEMBERS_KEY;

const deployFFFBusiness: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployment = await deploy("FFFBusiness", {
    from: deployer,
    args: [USDT_TETHER, MEMBERS_KEY],
    log: true,
    autoMine: true,
  });

  const transactionHash = deployment.transactionHash || "0x0";

  const receipt = await hre.ethers.provider.getTransactionReceipt(transactionHash);
  const gas = receipt?.gasUsed.toString();

  // Muestra información relevante
  console.log("🏆 Friends and Family Funds deployed at:", deployment.address);
  console.log("🚀 Gas utilizado para el despliegue:", gas);

  const newContract = await hre.ethers.getContract<Contract>("FFFBusiness", deployer);
  console.log("🏆 Friends and Family Funds is available with address:", await newContract.getAddress());
};

export default deployFFFBusiness;

deployFFFBusiness.tags = ["FFFBusiness"];
