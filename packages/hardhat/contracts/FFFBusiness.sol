// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract FFFBusiness {
    address payable private _businessWallet;
    uint128 private _totalMembers;
    uint128 private _totalActiveMembers;

    uint128 private _minAmountToTransfer = 10000000000000000;  // Currently is a wei unit (0.01 Ether)
    uint8 constant private _MAX_TICKETS = 8;
    
    uint8 private _refundTierOne = 5;
    uint8 private _refundTierTwo = 10;
    uint8 private _refundTierThree = 15;
    uint8 private _refundTierFour = 20;
    uint8 private _refundTierFive = 25;

    uint8 private _qualifyToImproveRank = 3;

    enum Ranks {
        Sapphire,   // 0
        Pearl,      // 1
        Ruby,       // 2
        Emerald,    // 3
        Diamond     // 4
    }

    struct Member {
        address payable memberWallet;
        bool isActive;
        uint balance;
        Ranks rank;
    }

    struct WithdrawTicket {
        address payable to;
        uint128 requestedAmount;
        uint32 requestDate;
        bool isPaid;
    }

    mapping(address => Member) private members;
    mapping(address => address[]) private enrolled;
    mapping(address => WithdrawTicket[]) private withdrawals;

    modifier onlyBusiness() {
        require(msg.sender == _businessWallet, "Error: Not the business");
        _;
    }

    modifier onlyActiveMember() {
        require(members[msg.sender].isActive, "Member not active");
        _;
    }

    modifier onlyActiveMemberStruct(Member memory _currentMember){
        require(_currentMember.isActive, "Member not active");
        _;
    }

    modifier onlyActiveMemberAddress(address _currentMember){
        require(members[_currentMember].isActive, "Member not active");
        _;
    }

    modifier checkMemberBalance(uint _amount) {
        require(members[msg.sender].balance >= _amount, "Insufficient balance");
        _;
    }

    modifier checkMemberBalanceStruct(Member memory _currentMember, uint _amount) {
        require(_currentMember.balance >= _amount, "Insufficient balance");
        _;
    }

    modifier checkContractBalance(uint _amount) {
        require(address(this).balance >= _amount, "The contract doesn't have sufficient balance");
        _;
    }

    modifier checkValidAddress(address _recipient) {
        require(_recipient != address(0), "Invalid address");
        _;
    }

    modifier checkMinimumAmount() {
        require(msg.value >= _minAmountToTransfer, "Minimum amount is 0.01 Ethers");
        _;
    }

    modifier preventZeroAmount(uint _currentAmount) {
        require(_currentAmount > 0, "The amount must be greater than zero");
        _;
    }

    event Deposit(address indexed from, uint amount);
    event Transfer(address indexed from, address indexed to, uint amount);
    event WithdrawalRequest(address indexed to, uint amount);
    event Refund(address indexed to, uint amount);
    
    event BusinessWalletSet(address indexed oldBusinessWallet, address indexed newBusinessWallet);
    event NewMember(address indexed member);
    event NewRankReached(address indexed member, string rank);

    constructor() {
        _businessWallet = payable(msg.sender);
        _totalMembers = 0;
        _totalActiveMembers = 0;
        emit BusinessWalletSet(address(0), _businessWallet);
    }

    function deposit() public payable {}

    function getTotalMembers() public view returns (uint) {
        return _totalMembers;
    }

    function getTotalActiveMembers() public view returns (uint) {
        return _totalActiveMembers;
    }

    function getBusinessWallet() public view returns (address) {
        return _businessWallet;
    }

    function changeBusinessWallet(address _newBusinessWallet) public onlyBusiness {
        emit BusinessWalletSet(_businessWallet, _newBusinessWallet);
        _businessWallet = payable(_newBusinessWallet);
    }

    function getMemberDetails(Member memory member)
        public
        pure
        returns (
            address, 
            bool,
            uint,
            Ranks
        ) 
    {
        require(member.isActive, "Member not registered");

        return (
            member.memberWallet,
            member.isActive,
            member.balance,
            member.rank
        );
    }

    function getMemberDetails(address _memberAddress)
        public
        view
        returns (
            address, 
            bool,
            uint,
            Ranks
        ) 
    {
        Member memory member = members[_memberAddress];
        require(member.isActive, "Member not registered");

        return (
            member.memberWallet,
            member.isActive,
            member.balance,
            member.rank
        );
    }

    function createMember(address payable _newMember) public {
        
        Member storage newMember = members[_newMember];
        newMember.memberWallet = _newMember;
        newMember.isActive = true;
        newMember.balance = 0;
        newMember.rank = Ranks.Sapphire;

        _totalMembers++;
        _totalActiveMembers++;

        emit NewMember(_newMember);
    }

    function addReferralToUpline(address _to, address _from)
        public
        onlyActiveMemberAddress(_to)
        checkValidAddress(_to)
    {
        enrolled[_to].push(_from);
        Member storage member = members[_to];
        updateReferralRank(member, _to);
    }

    function depositMemeberFunds(address _uplineAddress) 
        public
        payable
        checkMinimumAmount
    {

        if (!members[msg.sender].isActive) {
            createMember(payable(msg.sender));
            addReferralToUpline(_uplineAddress, msg.sender);
        }

        Member storage member = members[msg.sender];
        member.balance += msg.value;
        emit Deposit(msg.sender, msg.value);

        uint8 refundPercentToMember = _getRefundPerRank(member);

        uint refundToMember = _getRefundAmount(msg.value, refundPercentToMember);
        uint refundToBusiness = msg.value - refundToMember;
        require(refundToBusiness >= refundToMember, "Failed transaction");

        _payment(_businessWallet, refundToBusiness);
        _payment(payable(msg.sender), refundToMember);
        emit Refund(msg.sender, refundToMember);
    }

    function withdrawalRequest(uint128 _requestedAmount)
        public
        preventZeroAmount(_requestedAmount)
    {
        Member memory currentMember = members[msg.sender];
        require(currentMember.isActive, "Member not active");
        require(currentMember.balance >= _requestedAmount, "Insufficient balance");
        require(withdrawals[msg.sender].length <= _MAX_TICKETS, "Error can't request more than 5 withdrawals");

        WithdrawTicket memory currentTicket = WithdrawTicket({
            to: payable(msg.sender),
            requestedAmount: _requestedAmount,
            requestDate: uint32(block.timestamp),
            isPaid: false
        });
        withdrawals[msg.sender].push(currentTicket);
        emit WithdrawalRequest(msg.sender, _requestedAmount);
    }

    function payToMember(address _memberAddress, uint _amount)
        public
        onlyBusiness
        preventZeroAmount(_amount)
    {

    }

    function _payment(address payable _to, uint _amount)
        private
        preventZeroAmount(_amount)
    {
        (bool sent, ) = _to.call{ value: _amount }("");
        require(sent, "Failed transaction");
    }

    function _getRefundAmount(uint _totalAmount, uint _refundPercent) private pure returns (uint) {
        return (_totalAmount * _refundPercent) / 100;
    }

    function _getRefundPerRank(Member storage member)
        private
        view
        returns (uint8) 
    {
        if (member.rank == Ranks.Diamond) {
            return _refundTierFive;
        } 
        if (member.rank == Ranks.Emerald) {
            return _refundTierFour;
        } 
        if (member.rank == Ranks.Ruby) {
            return _refundTierThree;
        } 
        if (member.rank == Ranks.Pearl) {
            return _refundTierTwo;
        }

        return _refundTierOne;
    }

    function _setNewRank(
        Member storage currentMember,
        Ranks newRank,
        string memory nameRank
        ) private
    {
        currentMember.rank = newRank;
        emit NewRankReached(currentMember.memberWallet, nameRank);
    }

    function updateReferralRank(
        Member storage currentMember,
        address _currentMemberAddress
        ) private 
    {
        uint qualificationRank = enrolled[_currentMemberAddress].length / _qualifyToImproveRank;

        if (qualificationRank == 5 && currentMember.rank != Ranks.Diamond) {
            _setNewRank(
                currentMember,
                Ranks.Diamond,
                "Diamond"
            );
        } else if (qualificationRank == 4 && currentMember.rank != Ranks.Emerald) {
            _setNewRank(
                currentMember,
                Ranks.Emerald,
                "Emerald"
            );
        } else if (qualificationRank == 3 && currentMember.rank != Ranks.Ruby) {
            _setNewRank(
                currentMember,
                Ranks.Ruby,
                "Ruby"
            );
        } else if (qualificationRank == 2 && currentMember.rank != Ranks.Pearl) {
            _setNewRank(
                currentMember,
                Ranks.Pearl,
                "Pearl"
            );
        }
    }

}