// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FFFBusiness is Ownable, ReentrancyGuard {
	using SafeERC20 for IERC20;

	// USDT
	IERC20 public token;

	// For Bussiness
	address payable private _businessWallet;
    uint128 private _totalMembers;
    uint256 private _totalBalance; 

	//Limits
	uint128 private _MIN_AMOUNT_TO_DEPOSIT;
	uint128 private _MAX_CONTRACT_BALANCE;
	uint128 private _DEPOSIT_MULTIPLE;
    uint256 private _PYT_TIMESTAMP;
    uint256 private _COMMISSION_TIMESTAMP;
    uint128 private _MEMBERSHIP_PAYMENT_TO_BUSINESS;
    uint128 private _MEMBERSHIP_PAYMENT_TO_UPLINE;
    uint8 private _COMMISSION_PER_TIER_ONE;
    uint8 private _COMMISSION_PER_TIER_TWO;
    uint8 private _COMMISSION_PER_TIER_THREE;

	// Represents every client wallet
	struct Member {
		address payable memberWallet;
		bool isActive; 
		uint balance; // Total savings per client
	}

	mapping(address => Member) private members;
	mapping(address => address[]) private enrolled; // Warning! for verification only

    // Main Events
    event NewBusinessOwner(
        string message,
        address indexed oldOwner,
        address indexed newOwner,
        uint timestamp
    );
    event ConfigUpdated(
        string config,
        uint newValue,
        uint timestamp
    );
	event DepositContract(
        address indexed from,
        uint amount,
        uint timestamp
    );
	event TransferBusiness(
		address indexed from,
		uint amount,
		uint timestamp
	);
	event WithdrawalContract(
        address indexed to,
        uint amount,
        uint timestamp
    );
    event WithdrawalMember(
        address indexed to,
        uint amount,
        uint timestamp
    );
	event CommissionPaid(
        address indexed to,
        uint amount,
        uint timestamp
    );
    event MembershipPaid(
        address indexed from,
        uint amount,
        uint timestamp
    );
	event NewMember(
        address indexed member,
        uint timestamp
    );
    event NewSaving(
        address indexed member,
        uint amount,
        uint timestamp
    );

	// Initiallize USDT address && only DEPLOYER wallet is the OWNER!!!
	constructor(address _tokenAddress) {
		require(_tokenAddress != address(0), "Token address cannot be zero");

        // Ruleset for bussiness logic
        _MIN_AMOUNT_TO_DEPOSIT = 2000 * 10 ** 6; // 2000 USDT
        _MAX_CONTRACT_BALANCE = 10000000 * 10 ** 6; // 10M USDT
        _DEPOSIT_MULTIPLE = 500 * 10 ** 6; // Múltiple 500 USDT
        _PYT_TIMESTAMP = 90 days;
        _COMMISSION_TIMESTAMP = 30 days;
        _MEMBERSHIP_PAYMENT_TO_BUSINESS = 400;
        _MEMBERSHIP_PAYMENT_TO_UPLINE = 100;
        _COMMISSION_PER_TIER_ONE = 4;
        _COMMISSION_PER_TIER_TWO = 2;
        _COMMISSION_PER_TIER_THREE = 2;

        // Principal wallet
		_businessWallet = payable(msg.sender);

        // Token
		token = IERC20(_tokenAddress);

        // Balance for total members
        _totalBalance = 0;

        // Principal wallet is the first member
        _createMember(_businessWallet);
	}

    // Modofiers
	modifier onlyActiveMember() {
		require(members[msg.sender].isActive, "Miembro no activo");
		_;
	}

	modifier checkValidAddress(address _recipient) {
		require(_recipient != address(0), "Direccion invalida");
		_;
	}

    // Checkers
    function checkActiveMember(address _member) public view returns(bool) {
        return members[_member].isActive;
    }

    // Getters for bussiness logic vars
    function getTotalBalance() private view onlyOwner returns (uint) {
        return _totalBalance;
    }

    function getBusinessWallet() public view returns (address) {
        return _businessWallet;
    }

    function getTotalMembers() public view returns (uint) {
        return _totalMembers;
    }

	function getMemberBalance(address _currentMember) public view returns(uint) {
        return members[_currentMember].balance;
    }

    function getTotalAffiliatesPerMember(address _currentMember) public view returns(uint) {
        return enrolled[_currentMember].length;
    }

    function getMinAmountToDeposit() public view returns (uint128) {
        return _MIN_AMOUNT_TO_DEPOSIT;
    }

    function getMaxContractBalance() public view returns (uint128) {
        return _MAX_CONTRACT_BALANCE;
    }

    function getDepositMultiple() public view returns (uint128) {
        return _DEPOSIT_MULTIPLE;
    }

    function getPytTimestamp() public view returns (uint256) {
        return _PYT_TIMESTAMP;
    }

    function getCommissionTimestamp() public view returns (uint256) {
        return _COMMISSION_TIMESTAMP;
    }

    function getCurrentContractBalance() public view onlyOwner returns (uint256) {
        return token.balanceOf(address(this));
    }

        // Setters
    function setMinAmountToDeposit(uint128 _newMinAmount) external onlyOwner {
        require(_newMinAmount > 0, "Minimum amount must be greater than 0");
        require(_newMinAmount < _MAX_CONTRACT_BALANCE, "Min cannot exceed max");
        _MIN_AMOUNT_TO_DEPOSIT = _newMinAmount;
        emit ConfigUpdated("MIN_AMOUNT_TO_DEPOSIT", _newMinAmount, block.timestamp);
    }

    function setMaxContractBalance(uint128 _newMaxBalance) external onlyOwner {
        require(_newMaxBalance > _MIN_AMOUNT_TO_DEPOSIT, "Max must exceed min");
        _MAX_CONTRACT_BALANCE = _newMaxBalance;
        emit ConfigUpdated("MAX_CONTRACT_BALANCE", _newMaxBalance, block.timestamp);
    }

    function setDepositMultiple(uint128 _newMultiple) external onlyOwner {
        require(_newMultiple > 0, "Multiple must be greater than 0");
        _DEPOSIT_MULTIPLE = _newMultiple;
        emit ConfigUpdated("DEPOSIT_MULTIPLE", _newMultiple, block.timestamp);
    }

    function setMembershipPayments(uint128 _toBusiness, uint128 _toUpline) external onlyOwner {
        require(_toBusiness > 0 && _toUpline > 0, "Membership payments must be positive");
        _MEMBERSHIP_PAYMENT_TO_BUSINESS = _toBusiness;
        _MEMBERSHIP_PAYMENT_TO_UPLINE = _toUpline;
        emit ConfigUpdated("MEMBERSHIP_PAYMENTS", _toBusiness + _toUpline, block.timestamp);
    }

    function setCommissionRates(uint8 _tier1, uint8 _tier2, uint8 _tier3) external onlyOwner {
        require(_tier1 + _tier2 + _tier3 <= 100, "Total commission cannot exceed 100%");
        _COMMISSION_PER_TIER_ONE = _tier1;
        _COMMISSION_PER_TIER_TWO = _tier2;
        _COMMISSION_PER_TIER_THREE = _tier3;
        emit ConfigUpdated("COMMISSION_RATES", _tier1 + _tier2 + _tier3, block.timestamp);
    }

    function setTimestamps(uint256 _pyt, uint256 _commission) external onlyOwner {
        require(_pyt > 0 && _commission > 0, "Timestamps must be greater than 0");
        _PYT_TIMESTAMP = _pyt;
        _COMMISSION_TIMESTAMP = _commission;
        emit ConfigUpdated("TIMESTAMPS", _pyt + _commission, block.timestamp);
    }

    function setBusinessWallet(address payable _newBusinessWallet) external onlyOwner {
        require(_newBusinessWallet != address(0), "Invalid address");
        _businessWallet = _newBusinessWallet;
        emit NewBusinessOwner("BUSINESS_WALLET", _businessWallet, _newBusinessWallet, block.timestamp);
    }


	function memberEntrance(
        address _uplineAddress,
        address _secondLevelUpline,
        address _thirtLevelUpline,
        uint _amount
    ) public {
        if (!members[msg.sender].isActive) {
            _createMember(payable(msg.sender));
        }
        if (_uplineAddress != address(0)) {
            enrolled[_uplineAddress].push(msg.sender);
        } else {
            enrolled[_businessWallet].push(msg.sender);
        }

        _firstDeposit(_amount, _uplineAddress, _secondLevelUpline, _thirtLevelUpline);
    }

	function deposit(uint256 _amount) external onlyOwner() {
        uint256 realBalance = getCurrentContractBalance() + _amount;
        require(realBalance <= _MAX_CONTRACT_BALANCE, "El deposito no puede superar el limite del contrato");
        _deposit(msg.sender, _amount);
    }

    function withdraw() external onlyOwner {
        uint256 currentBalance = getCurrentContractBalance();
        _withdraw(msg.sender, currentBalance);
    }

    function paymentCommissions (
        uint256 _paymentAmount,
        address _memberAddress
    ) external onlyOwner checkValidAddress(_memberAddress) {
        require(getCurrentContractBalance() >= _paymentAmount, "Contrato no cuenta con suficientes fondos");
        _processPayment(_memberAddress, _paymentAmount);
        emit CommissionPaid(_memberAddress, _paymentAmount, block.timestamp);
    }

    // Provitional function for decrease memberfunds, in case to whitdraw in a future
    function decreaseMemberFunds(
        address _memberAddress,
        uint _decreaseAmount
    ) external onlyOwner {
        Member storage currentMember = members[_memberAddress];
        require(currentMember.isActive, "Miembro no activo");
        require(currentMember.balance >= _decreaseAmount, "Monto invalido");

        currentMember.balance -= _decreaseAmount;
        emit WithdrawalMember(_memberAddress, _decreaseAmount, block.timestamp);
    }

    function depositMemberFunds(
        uint _amount,
        address _firstLevelUpline,
        address _secondLevelUpline,
        address _thirtLevelUpline
    ) public onlyActiveMember {
        require(_amount >= _MIN_AMOUNT_TO_DEPOSIT, "Deposito no alcanza monto minimo");
        require(_amount % _DEPOSIT_MULTIPLE == 0, "Valor del deposito no es valido");
        require(_totalBalance + _amount <= _MAX_CONTRACT_BALANCE, "Deposito supera el monto soportado por el contrato");

        _deposit(msg.sender, _amount);

        // Update total balance in contract
        _totalBalance += _amount;

        members[msg.sender].balance += _amount;
        emit NewSaving(msg.sender, _amount, block.timestamp);

        uint256 commissionFirstLevel = _calculateCommission(_amount, _COMMISSION_PER_TIER_ONE);
        uint256 commissionSecondLevel = _calculateCommission(_amount, _COMMISSION_PER_TIER_TWO);
        uint256 commissionThirtLevel = _calculateCommission(_amount, _COMMISSION_PER_TIER_THREE);
        uint256 totalCommissions = commissionFirstLevel + commissionSecondLevel + commissionThirtLevel;

        uint256 finalDeposit = _amount - totalCommissions;
        require(finalDeposit > totalCommissions, "Error en el calculo de comisiones");

        // Payment to uplines in case exists
        if (_firstLevelUpline != address(0)) {
            _processPayment(_firstLevelUpline, commissionFirstLevel);
            emit CommissionPaid(_firstLevelUpline, commissionFirstLevel, block.timestamp);
            commissionFirstLevel = 0;
        }
        if (_secondLevelUpline != address(0)) {
            _processPayment(_secondLevelUpline, commissionSecondLevel);
            emit CommissionPaid(_secondLevelUpline, commissionSecondLevel, block.timestamp);
            commissionSecondLevel = 0;
        }
        if (_thirtLevelUpline != address(0)) {
            _processPayment(_thirtLevelUpline, commissionThirtLevel);
            emit CommissionPaid(_thirtLevelUpline, commissionFirstLevel, block.timestamp);
            commissionThirtLevel = 0;
        }

        // final calculation after to pay uplines
        finalDeposit += (commissionFirstLevel + commissionSecondLevel + commissionThirtLevel);

        _processPayment(_businessWallet, finalDeposit);

        // Update total balance in contract with total amount per deposit
        _totalBalance += _amount;

        emit TransferBusiness(msg.sender, _amount, block.timestamp);

    }

	function _processPayment(address _to, uint256 _amount) private {
        require(_amount > 0, "La cantidad a transferir debe ser mayor a cero");
        token.safeTransfer(_to, _amount);
    }

    function _firstDeposit(
        uint256 _amount,
        address _uplineAddress,
        address _secondLevelUpline,
        address _thirtLevelUpline
    ) private onlyActiveMember {
        uint256 membership = _MEMBERSHIP_PAYMENT_TO_BUSINESS + _MEMBERSHIP_PAYMENT_TO_UPLINE;
        uint256 firstDeposit = _amount - membership;

        require(_amount >= _MIN_AMOUNT_TO_DEPOSIT + membership, "Monto insuficiente");
        _deposit(msg.sender, _amount);

        // Membership payment to bussiness
        _processPayment(_businessWallet, _MEMBERSHIP_PAYMENT_TO_BUSINESS);
        emit MembershipPaid(msg.sender, _MEMBERSHIP_PAYMENT_TO_BUSINESS, block.timestamp);
        // Membership payment to upline
        _processPayment(_uplineAddress, _MEMBERSHIP_PAYMENT_TO_UPLINE);
        emit CommissionPaid(_uplineAddress, _MEMBERSHIP_PAYMENT_TO_UPLINE, block.timestamp);

        // For saving
        depositMemberFunds(firstDeposit, _uplineAddress, _secondLevelUpline, _thirtLevelUpline);

        emit NewSaving(msg.sender, firstDeposit, block.timestamp);
    }

    function _deposit(address _from, uint256 _amount) private {
        require(_amount <= token.balanceOf(_from), "No cuentas con USDT en tu wallet");
        require(_amount > 0, "Deposito no puede ser vacio");
        token.safeTransferFrom(_from, address(this), _amount);
        emit DepositContract(_from, _amount, block.timestamp);
    }

    function _withdraw(address _to, uint256 _amount) private nonReentrant {
        require(getCurrentContractBalance() >= _amount, "Contrato no cuenta con suficientes fondos");
        _processPayment(_to, _amount);
        emit WithdrawalContract(msg.sender, _amount, block.timestamp);
    }

    function _calculateCommission(uint256 _amount, uint256 _refundPercent) private pure returns (uint) {
        return (_amount * _refundPercent) / 100;
    }

	function _createMember(address payable _newMember) private checkValidAddress(_newMember) {
        members[_newMember] = Member({
            memberWallet: _newMember,
            isActive: true,
            balance: 0
        });

        _totalMembers++;
        emit NewMember(_newMember, block.timestamp);
    }
    
	receive() external payable {
		revert("Ether not accepted");
	}

	fallback() external payable {
		revert("Function not supported");
	}


}
