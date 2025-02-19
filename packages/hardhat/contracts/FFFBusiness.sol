// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FFFBusiness is Ownable, AccessControl, ReentrancyGuard {
	using SafeERC20 for IERC20;

	//Securty
	bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
	bytes32 private _MEMBER_KEY;

	// USDT
	IERC20 public token;

	// For Bussiness
	address payable private _businessWallet;
	uint128 private _totalMembers;
	uint256 private _totalBalance;

	//Limits
	uint256 private _MIN_AMOUNT_TO_DEPOSIT;
	uint256 private _MAX_CONTRACT_BALANCE;
	uint256 private _DEPOSIT_MULTIPLE;
	uint256 private _MEMBERSHIP_PAYMENT_TO_BUSINESS;
	uint256 private _MEMBERSHIP_PAYMENT_TO_UPLINE;
	uint8 private _COMMISSION_PER_TIER_ONE;
	uint8 private _COMMISSION_PER_TIER_TWO;
	uint8 private _COMMISSION_PER_TIER_THREE;

	//Testing events
	event Log(string message, uint amount);
	event ProccessPayment(string message, address indexed to, uint amount);

	// Setup events
	event NewBusinessOwner(
		string message,
		address indexed oldOwner,
		address indexed newOwner,
		uint timestamp
	);
	event ConfigUpdated(string config, uint newValue, uint timestamp);

	//Security events
	event KeyUpdated(address indexed updater);

	//Business events
	event DepositContract(address indexed from, uint amount, uint timestamp);
	event TransferBusiness(address indexed from, uint amount, uint timestamp);
	event WithdrawalContract(address indexed to, uint amount, uint timestamp);
	event MembershipPaid(address indexed from, uint amount, uint timestamp);

	//Member events
	event WithdrawalMember(address indexed member, address indexed to , uint amount, uint timestamp);
	event CommissionPaid(address indexed to, uint amount, uint timestamp);
	event PullCommissionPaid(address indexed to, uint amount, uint timestamp);
	event NewMember(address indexed member, uint timestamp);
	event NewSaving(address indexed member, uint amount, uint timestamp);

	// Initiallize USDT address && only DEPLOYER wallet is the OWNER!!!
	constructor(address _tokenAddress, string memory memberKey) {
		require(_tokenAddress != address(0), "Token address cannot be zero");

		// Role
		_setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_setupRole(ADMIN_ROLE, msg.sender);

		// Member invitation key
		_MEMBER_KEY = keccak256(abi.encodePacked(memberKey));

		// Ruleset for bussiness logic
		_MIN_AMOUNT_TO_DEPOSIT = 2000 * 10 ** 6; // 2000 USDT
		_MAX_CONTRACT_BALANCE = 10000000 * 10 ** 6; // 10M USDT
		_DEPOSIT_MULTIPLE = 500 * 10 ** 6; // Múltiple 500 USDT
		_MEMBERSHIP_PAYMENT_TO_BUSINESS = 400 * 10 ** 6; //400 USDT
		_MEMBERSHIP_PAYMENT_TO_UPLINE = 100 * 10 ** 6; //100 USDT
		_COMMISSION_PER_TIER_ONE = 4;
		_COMMISSION_PER_TIER_TWO = 2;
		_COMMISSION_PER_TIER_THREE = 2;

		// Principal wallet
		_businessWallet = payable(msg.sender);

		// Token
		token = IERC20(_tokenAddress);

		// Balance for total members
		_totalBalance = 0;
	}

	// Modofiers
	modifier onlyActiveMember(string memory _memberKey) {
		require(
			keccak256(abi.encodePacked(_memberKey)) == _MEMBER_KEY,
			"Codigo de invitacion invalido"
		);
		_;
	}

	modifier checkValidAddress(address _recipient) {
		require(_recipient != address(0), "Direccion invalida");
		_;
	}

	// Getters for bussiness logic vars
	function getTotalBalance() private view returns (uint) {
		return _totalBalance;
	}

	function getBusinessWallet() public view returns (address) {
		return _businessWallet;
	}

	function getTotalMembers() public view returns (uint) {
		return _totalMembers;
	}

	function getMinAmountToDeposit() public view returns (uint256) {
		return _MIN_AMOUNT_TO_DEPOSIT;
	}

	function getMaxContractBalance() public view returns (uint256) {
		return _MAX_CONTRACT_BALANCE;
	}

	function getDepositMultiple() public view returns (uint256) {
		return _DEPOSIT_MULTIPLE;
	}

	function getCurrentContractBalance() public view returns (uint256) {
		return token.balanceOf(address(this));
	}

	function getMembershipPaymentToBusiness() public view returns (uint256) {
		return _MEMBERSHIP_PAYMENT_TO_BUSINESS;
	}

	function getMembershipPaymentToUpline() public view returns (uint256) {
		return _MEMBERSHIP_PAYMENT_TO_UPLINE;
	}

	function getCommissionPerFistLevelUpline() public view returns (uint8) {
		return _COMMISSION_PER_TIER_ONE;
	}

	function getCommissionPerSecondLevelUpline() public view returns (uint8) {
		return _COMMISSION_PER_TIER_TWO;
	}

	function getCommissionPerThirtLevelUpline() public view returns (uint8) {
		return _COMMISSION_PER_TIER_THREE;
	}

	function setMinAmountToDeposit(
		uint256 _newMinAmount
	) external onlyRole(ADMIN_ROLE) {
		require(_newMinAmount > 0, "Minimum amount must be greater than 0");
		require(_newMinAmount < _MAX_CONTRACT_BALANCE, "Min cannot exceed max");
		_MIN_AMOUNT_TO_DEPOSIT = _newMinAmount;
		emit ConfigUpdated(
			"MIN_AMOUNT_TO_DEPOSIT",
			_newMinAmount,
			block.timestamp
		);
	}

	function setMaxContractBalance(uint256 _newMaxBalance) external onlyOwner {
		require(_newMaxBalance > _MIN_AMOUNT_TO_DEPOSIT, "Max must exceed min");
		_MAX_CONTRACT_BALANCE = _newMaxBalance;
		emit ConfigUpdated(
			"MAX_CONTRACT_BALANCE",
			_newMaxBalance,
			block.timestamp
		);
	}

	function setDepositMultiple(
		uint256 _newMultiple
	) external onlyRole(ADMIN_ROLE) {
		require(_newMultiple > 0, "Multiple must be greater than 0");
		_DEPOSIT_MULTIPLE = _newMultiple;
		emit ConfigUpdated("DEPOSIT_MULTIPLE", _newMultiple, block.timestamp);
	}

	function setMembershipPaymentToBusiness(
		uint256 _toBusiness
	) external onlyOwner {
		require(_toBusiness > 0, "Membership payments must be positive");
		require(
			_toBusiness < _MAX_CONTRACT_BALANCE,
			"Payment to Business cannot exceed max"
		);
		_MEMBERSHIP_PAYMENT_TO_BUSINESS = _toBusiness;
		emit ConfigUpdated(
			"MEMBERSHIP_PAYMENT_TO_BUSINESS",
			_toBusiness,
			block.timestamp
		);
	}

	function setMembershipPaymentToUpline(
		uint256 _toUpline
	) external onlyOwner {
		require(_toUpline > 0, "Membership payments must be positive");
		require(
			_toUpline < _MAX_CONTRACT_BALANCE,
			"Payment to Upline cannot exceed max"
		);
		_MEMBERSHIP_PAYMENT_TO_UPLINE = _toUpline;
		emit ConfigUpdated(
			"MEMBERSHIP_PAYMENT_TO_UPLINE",
			_toUpline,
			block.timestamp
		);
	}

	function setCommissionPerFistLevelUpline(
		uint8 _tier1
	) external onlyRole(ADMIN_ROLE) {
		require(_tier1 > 0, "Commission payments must be positive");
		require(_tier1 <= 100, "Commission cannot exceed 100%");
		_COMMISSION_PER_TIER_ONE = _tier1;
		emit ConfigUpdated(
			"COMMISSION_PER_FIRST_LEVEL_UPDATED",
			_tier1,
			block.timestamp
		);
	}

	function setCommissionPerSecondLevelUpline(
		uint8 _tier2
	) external onlyRole(ADMIN_ROLE) {
		require(_tier2 > 0, "Commission payments must be positive");
		require(_tier2 <= 100, "Commission cannot exceed 100%");
		_COMMISSION_PER_TIER_TWO = _tier2;
		emit ConfigUpdated(
			"COMMISSION_PER_SECOND_LEVEL_UPDATED",
			_tier2,
			block.timestamp
		);
	}

	function setCommissionPerThirtLevelUpline(
		uint8 _tier3
	) external onlyRole(ADMIN_ROLE) {
		require(_tier3 > 0, "Commission payments must be positive");
		require(_tier3 <= 100, "Total commission cannot exceed 100%");
		_COMMISSION_PER_TIER_THREE = _tier3;
		emit ConfigUpdated(
			"COMMISSION_PER_THIRT_LEVEL_UPDATED",
			_tier3,
			block.timestamp
		);
	}

	function addAdmin(address account) external onlyOwner {
		grantRole(ADMIN_ROLE, account);
	}

	function removeAdmin(address account) external onlyOwner {
		revokeRole(ADMIN_ROLE, account);
	}

	function paymentCommissions(
		uint256 _paymentAmount,
		address _memberAddress,
		bool _isPullCommission
	) external checkValidAddress(_memberAddress) onlyRole(ADMIN_ROLE) {
		_withdraw(_memberAddress, _paymentAmount);

		if (_isPullCommission == true) {
			emit PullCommissionPaid(
				_memberAddress,
				_paymentAmount,
				block.timestamp
			);
		} else {
			emit CommissionPaid(
				_memberAddress,
				_paymentAmount,
				block.timestamp
			);
		}
	}

	function liquidateMemberFunds(
		uint256 _paymentAmount,
		address _memberAddress,
		uint256 _currentMemberBalance,
		address _walletToPay
	) external checkValidAddress(_memberAddress) onlyRole(ADMIN_ROLE) {
		require(_currentMemberBalance >= _paymentAmount, "Monto invalido");

		// Update balance for deposit members in smart Contract
		_totalBalance -= _paymentAmount;
		
		require(_walletToPay != address(0), "Direccion de wallet de destino no valida");

		_withdraw(_walletToPay, _paymentAmount);
		emit WithdrawalMember(_memberAddress, _walletToPay, _paymentAmount, block.timestamp);
	}

	function setBusinessWallet(
		address payable _newBusinessWallet
	) external onlyOwner {
		require(_newBusinessWallet != address(0), "Direccion de nueva wallet no valida");

		_businessWallet = _newBusinessWallet;

		transferOwnership(_newBusinessWallet);

		_revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);

		_grantRole(DEFAULT_ADMIN_ROLE, _newBusinessWallet);

		emit NewBusinessOwner(
			"BUSINESS_WALLET",
			_businessWallet,
			_newBusinessWallet,
			block.timestamp
		);
	}

	function memberEntrance(
		address _uplineAddress,
		address _secondLevelUpline,
		address _thirtLevelUpline,
		uint256 _amount,
		string memory _memberKey
	) public {
		_totalMembers++;
		emit NewMember(msg.sender, block.timestamp);

		_firstDeposit(
			_amount,
			_uplineAddress,
			_secondLevelUpline,
			_thirtLevelUpline,
			_memberKey
		);
	}

	function deposit(uint256 _amount) external onlyRole(ADMIN_ROLE) {
		uint256 realBalance = getCurrentContractBalance() + _amount;
		require(
			realBalance <= _MAX_CONTRACT_BALANCE,
			"El deposito no puede superar el limite del contrato"
		);
		_deposit(msg.sender, _amount);
	}

	function withdraw() external onlyOwner {
		uint256 currentBalance = getCurrentContractBalance();
		_withdraw(msg.sender, currentBalance);
	}

	function depositMemberFunds(
		uint256 _amount,
		address _firstLevelUpline,
		address _secondLevelUpline,
		address _thirtLevelUpline,
		string memory _memberKey
	) public onlyActiveMember(_memberKey) {
		require(
			_amount >= _MIN_AMOUNT_TO_DEPOSIT,
			"Deposito no alcanza monto minimo"
		);
		require(
			_amount % _DEPOSIT_MULTIPLE == 0,
			"Valor del deposito no es valido"
		);
		require(
			_totalBalance + _amount <= _MAX_CONTRACT_BALANCE,
			"Deposito supera el monto soportado por el contrato"
		);

		_deposit(msg.sender, _amount);

		emit NewSaving(msg.sender, _amount, block.timestamp);

		uint256 commissionFirstLevel = _calculateCommission(
			_amount,
			_COMMISSION_PER_TIER_ONE
		);
		uint256 commissionSecondLevel = _calculateCommission(
			_amount,
			_COMMISSION_PER_TIER_TWO
		);
		uint256 commissionThirtLevel = _calculateCommission(
			_amount,
			_COMMISSION_PER_TIER_THREE
		);
		uint256 totalCommissions = commissionFirstLevel +
			commissionSecondLevel +
			commissionThirtLevel;

		uint256 finalDeposit = _amount - totalCommissions;

		require(
			finalDeposit > totalCommissions,
			"Error en el calculo de comisiones"
		);

		// Payment to uplines
		commissionFirstLevel = _commissionPayment(
			_firstLevelUpline,
			commissionFirstLevel,
			true
		);
		commissionSecondLevel = _commissionPayment(
			_secondLevelUpline,
			commissionSecondLevel,
			true
		);
		commissionThirtLevel = _commissionPayment(
			_thirtLevelUpline,
			commissionThirtLevel,
			true
		);

		finalDeposit += (commissionFirstLevel +
			commissionSecondLevel +
			commissionThirtLevel);

		_processPayment(_businessWallet, finalDeposit);

		_totalBalance += _amount;

		emit TransferBusiness(msg.sender, finalDeposit, block.timestamp);
	}

	function _firstDeposit(
		uint256 _amount,
		address _uplineAddress,
		address _secondLevelUpline,
		address _thirtLevelUpline,
		string memory _memberKey
	) private {
		uint256 membership = _MEMBERSHIP_PAYMENT_TO_BUSINESS +
			_MEMBERSHIP_PAYMENT_TO_UPLINE;
		uint256 firstDeposit = _amount - membership;

		require(
			_amount >= _MIN_AMOUNT_TO_DEPOSIT + membership,
			"Monto insuficiente"
		);
		_deposit(msg.sender, membership);

		// Membership payment to bussiness
		_processPayment(_businessWallet, _MEMBERSHIP_PAYMENT_TO_BUSINESS);
		emit MembershipPaid(
			msg.sender,
			_MEMBERSHIP_PAYMENT_TO_BUSINESS,
			block.timestamp
		);

		// Membership payment to upline
		_commissionPayment(
			_uplineAddress,
			_MEMBERSHIP_PAYMENT_TO_UPLINE,
			false
		);

		// For saving
		depositMemberFunds(
			firstDeposit,
			_uplineAddress,
			_secondLevelUpline,
			_thirtLevelUpline,
			_memberKey
		);

		emit NewSaving(msg.sender, firstDeposit, block.timestamp);
	}

	/**
	 * Simple function that verifies commission distribution
	 * and return the same value of amount,
	 * with the option to reset the amount to zero
	 */
	function _commissionPayment(
		address _to,
		uint256 _amount,
		bool _isReset
	) private returns (uint256) {
		if (_to != address(0)) {
			_processPayment(_to, _amount);
			emit CommissionPaid(_to, _amount, block.timestamp);

			if (_isReset == true) {
				_amount = 0;
			}
		}

		return _amount;
	}

	function _processPayment(address _to, uint256 _amount) private {
		require(_amount > 0, "La cantidad a transferir debe ser mayor a cero");
		token.safeTransfer(_to, _amount);
		emit ProccessPayment("From business contract", _to, _amount);
	}

	function _deposit(address _from, uint256 _amount) private {
		require(
			token.allowance(_from, address(this)) >= _amount,
			"Insufficient allowance"
		);
		require(
			_amount <= token.balanceOf(_from),
			"No cuentas con USDT en tu wallet"
		);
		require(_amount > 0, "Deposito no puede ser vacio");
		token.safeTransferFrom(_from, address(this), _amount);
		emit DepositContract(_from, _amount, block.timestamp);
	}

	function _withdraw(address _to, uint256 _amount) private nonReentrant {
		require(
			getCurrentContractBalance() >= _amount,
			"Contrato no cuenta con suficientes fondos"
		);
		_processPayment(_to, _amount);
		emit WithdrawalContract(msg.sender, _amount, block.timestamp);
	}

	function _calculateCommission(
		uint256 _amount,
		uint256 _refundPercent
	) private pure returns (uint) {
		return (_amount * _refundPercent) / 100;
	}

	receive() external payable {
		revert("Ether not accepted");
	}

	fallback() external payable {
		revert("Function not supported");
	}
}
