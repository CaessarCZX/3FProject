// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract _deprecated_v2 {
    IERC20 public token;
    address payable private _businessWallet;
    uint128 private _totalMembers;

   // To modify when contract is changed to USDT
    uint128 private constant _MIN_AMOUNT_TO_TRANSFER = 2000 * 10**6; // 2000 USDT
    uint128 private constant _MAX_MEMBER_BALANCE = 50000 * 10**6; // 50,000 USDT en ether (31.07 ETH)
    uint128 private constant _DEPOSIT_MULTIPLE = 1000 * 10**6; // Múltiplo de 1000 USDT en ether (0.62 ETH)

    uint8 private constant _REFUND_TIER_ONE = 5;
    uint8 private constant _REFUND_TIER_TWO = 10;
    uint8 private constant _REFUND_TIER_THREE = 15;
    uint8 private constant _REFUND_TIER_FOUR = 20;
    uint8 private constant _REFUND_TIER_FIVE = 25;

    uint8 private constant _QUALIFY_TO_IMPROVE_RANK = 3;

    enum Ranks { Sapphire, Pearl, Ruby, Emerald, Diamond }

    struct Member {
        address payable memberWallet;
        bool isActive;
        uint balance;
        Ranks rank;
    }

    mapping(address => Member) private members;
    mapping(address => address[]) private enrolled;

    event Deposit(address indexed from, uint amount, uint timestamp);
    event Transfer(address indexed from, address indexed to, uint amount, uint timestamp);
    event WithdrawalRequest(address indexed to, uint amount, uint timestamp);
    event Refund(address indexed to, uint amount, uint timestamp);
    event NewMember(address indexed member, uint timestamp);
    event NewRankReached(address indexed member, string rank, uint timestamp);

    constructor(address tokenAddress) {
        _businessWallet = payable(msg.sender);
        token = IERC20(tokenAddress);  
        createMember(_businessWallet);
    }

    modifier onlyActiveMember() {
        require(members[msg.sender].isActive, "Miembro no activo");
        _;
    }

    modifier checkValidAddress(address _recipient) {
        require(_recipient != address(0), "Direccion invalida");
        _;
    }

    // Only for development
    function getBusinessWallet() public view returns (address) {
        return _businessWallet;
    }

    function getTotalMembers() public view returns (uint) {
        return _totalMembers;
    }
    // =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+

    receive() external payable {}

    function deposit() public payable {}

    function depositMemberFunds(uint _amount) public {
        require(_amount <= token.balanceOf(msg.sender), "No cuentas con USDT en tu wallet");
        require(_amount >= _MIN_AMOUNT_TO_TRANSFER, "Deposito minimo es de 2000 USDT");
        require(_amount % _DEPOSIT_MULTIPLE == 0, "Solo puede depositar de mil en mil");

        Member storage member = members[msg.sender];
        uint newTotalBalance = member.balance + _amount;
        require(newTotalBalance <= _MAX_MEMBER_BALANCE, "Has alcanzado el limite maxiomo de 50,000 USDT");

        require(token.transferFrom(msg.sender, address(this), _amount), "Transferencia fallida");

        member.balance += _amount;
        emit Deposit(msg.sender, _amount, block.timestamp);

        uint refundToMember = _calculateRefund(_amount, member.rank);
        uint refundToBusiness = _amount - refundToMember;

        _processPayment(_businessWallet, refundToBusiness);
        _processPayment(payable(msg.sender), refundToMember);
        emit Refund(msg.sender, refundToMember, block.timestamp);
    }

    function memberEntrance(address _uplineAddress, uint _amount) public {
        if (!members[msg.sender].isActive) {
            createMember(payable(msg.sender));
        }
        if (_uplineAddress != address(0)) {
            enrolled[_uplineAddress].push(msg.sender);
            _updateMemberRank(_uplineAddress);
        }

        depositMemberFunds(_amount);
    }

    function getMemberBalance(address _currentMember) public view returns(uint) {
        return members[_currentMember].balance;
    }

    function getTotalAffiliatesPerMember(address _currentMember) public view returns(uint) {
        return enrolled[_currentMember].length;
    }

    function checkActiveMember(address _member) public view returns(bool) {
        return members[_member].isActive;
    }

    function _processPayment(address payable _to, uint _amount) private {
        require(_amount > 0, "La cantidad a tranferir debe ser mayor a cero");
        require(token.transfer(_to, _amount), "Ha fallado la tranferencia");
    }

    function _calculateRefund(uint _amount, Ranks _rank) private pure returns (uint) {
        uint refundPercent;
        if (_rank == Ranks.Diamond) refundPercent = _REFUND_TIER_FIVE;
        else if (_rank == Ranks.Emerald) refundPercent = _REFUND_TIER_FOUR;
        else if (_rank == Ranks.Ruby) refundPercent = _REFUND_TIER_THREE;
        else if (_rank == Ranks.Pearl) refundPercent = _REFUND_TIER_TWO;
        else refundPercent = _REFUND_TIER_ONE;

        return (_amount * refundPercent) / 100;
    }

    function _updateMemberRank(address _uplineAddress) private {
        Member storage member = members[_uplineAddress];
        uint referralCount = enrolled[_uplineAddress].length;

        if (referralCount / _QUALIFY_TO_IMPROVE_RANK >= 5 && member.rank != Ranks.Diamond) {
            member.rank = Ranks.Diamond;
            emit NewRankReached(_uplineAddress, "Diamond", block.timestamp);
        } else if (referralCount / _QUALIFY_TO_IMPROVE_RANK >= 4 && member.rank != Ranks.Emerald) {
            member.rank = Ranks.Emerald;
            emit NewRankReached(_uplineAddress, "Emerald", block.timestamp);
        } else if (referralCount / _QUALIFY_TO_IMPROVE_RANK >= 3 && member.rank != Ranks.Ruby) {
            member.rank = Ranks.Ruby;
            emit NewRankReached(_uplineAddress, "Ruby", block.timestamp);
        } else if (referralCount / _QUALIFY_TO_IMPROVE_RANK >= 2 && member.rank != Ranks.Pearl) {
            member.rank = Ranks.Pearl;
            emit NewRankReached(_uplineAddress, "Pearl", block.timestamp);
        }
    }

    function createMember(address payable _newMember) internal checkValidAddress(_newMember) {
        members[_newMember] = Member({
            memberWallet: _newMember,
            isActive: true,
            balance: 0,
            rank: Ranks.Sapphire
        });

        _totalMembers++;
        emit NewMember(_newMember, block.timestamp);
    }
}
