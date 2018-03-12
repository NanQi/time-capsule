pragma solidity ^0.4.18;

contract TimeCapsule {

    event NewCapsule(uint capsuleId, uint32 time, bool encrypt);

    struct Capsule {
        string content; //胶囊内容
        string tips; //未到期提示
        uint32 createAt; //创建时间
        uint32 expireAt; //到期时间
        bool encrypt; //是否加密
    }

    Capsule[] private capsules;

    mapping (uint => address) private capsuleToOwner;
    mapping (address => uint) private ownerCapsuleCount;

    uint randNonce = 0;

    function randMod(uint _modulus) public view returns(uint) {
        return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
    }

    function buried(string _content, string _tips, uint32 _time, bool _encrypt) public {
        uint id = capsules.push(Capsule(_content, _tips, uint32(now), _time, _encrypt)) - 1;
        capsuleToOwner[id] = msg.sender;
        ownerCapsuleCount[msg.sender]++;
        randNonce++;
        NewCapsule(id, _time, _encrypt);
    }

    function dug() public view returns (uint8 code, string content, uint32 time) {
        // require(capsules.length == 0);

        uint rand = randMod(capsules.length);
        Capsule memory capsule = capsules[rand];
        if (!capsule.encrypt) {
            if (capsule.expireAt < now) {
                return (0, capsule.content, capsule.createAt);
            } else {
                return (1, capsule.tips, capsule.expireAt);
            }
        } else {
            return (2, "加密胶囊", 0);
        }
    }

    function getCapsuleById(uint _id) public view returns(string content, string tips, uint32 createAt, uint32 expireAt, bool encrypt) {
        if (capsuleToOwner[_id] == msg.sender) {
            Capsule memory capsule = capsules[_id];
            if (capsule.expireAt < now) {
                return (capsule.content, capsule.tips, capsule.createAt, capsule.expireAt, capsule.encrypt);
            } else {
                return ("", capsule.tips, capsule.createAt, capsule.expireAt, capsule.encrypt);
            }
        } else {
            return ("", "", 0, 0, false);
        }
    }

    function getAllCapsules() public view returns(uint[]) {
        uint[] memory result = new uint[](ownerCapsuleCount[msg.sender]);
        uint counter = 0;
        for (uint i = 0; i < capsules.length; i++) {
            if (capsuleToOwner[i] == msg.sender) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}
