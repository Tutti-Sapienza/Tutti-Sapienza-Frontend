// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Simple NFT contract with basic EIP-3664 functionality and ENS integration
contract TuttiSapienzaNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    Counters.Counter private _tokenIdCounter;
    
    // For future EIP-3664 implementation
    struct Trait {
        string traitType;
        uint256 value;
    }
    
    // Mapping from token ID to traits
    mapping(uint256 => Trait[]) private _tokenTraits;
    
    // ENS integration variables
    address public ensRegistryAddress;
    string public ensDomain;
    address public constant DEPLOYED_ADDRESS = 0x5b5bdC053F77127AA067dDCfa9C7eFf38Ca2c31A;
    
    constructor() ERC721("Tutti Sapienza Whitepaper", "TUTTI") {
        // Set the ENS domain for this contract
        ensDomain = "tuttisapienza.eth";
    }
    
    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
    
    // Add a trait to a token
    function addTrait(uint256 tokenId, string memory traitType, uint256 value) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        _tokenTraits[tokenId].push(Trait(traitType, value));
    }
    
    // Get traits for a token
    function getTraits(uint256 tokenId) public view returns (Trait[] memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenTraits[tokenId];
    }
    
    // ENS integration functions
    
    // Update the ENS registry address if needed
    function setENSRegistryAddress(address _ensRegistryAddress) public onlyOwner {
        ensRegistryAddress = _ensRegistryAddress;
    }
    
    // Verify if the message sender owns the ENS domain
    function verifyENSDomainOwner() public view returns (bool) {
        // In a production environment, this would query the ENS Registry
        // For now, we'll assume the contract owner also owns the ENS domain
        return msg.sender == owner();
    }
    
    // Get the domain associated with this contract
    function getENSDomain() public view returns (string memory) {
        return ensDomain;
    }
    
    // Override functions required by ERC721
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}