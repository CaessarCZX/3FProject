import { Contract } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployFFFBusiness: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("FFFBusiness", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const newContract = await hre.ethers.getContract<Contract>("FFFBusiness", deployer);
  console.log("🏆 Friends and Family Funds is available with address:", await newContract.getAddress());
};

export default deployFFFBusiness;

deployFFFBusiness.tags = ["FFFBusiness"];
