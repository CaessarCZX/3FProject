import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployFFFBusiness: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("FFFBusiness", {
    from: deployer,
    args: ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
    log: true,
    autoMine: true,
  });

  const newContract = await hre.ethers.getContract<Contract>("FFFBusiness", deployer);
  console.log("🏆 Friends and Family Funds is available with address:", await newContract.getAddress());
};

export default deployFFFBusiness;

deployFFFBusiness.tags = ["FFFBusiness"];
