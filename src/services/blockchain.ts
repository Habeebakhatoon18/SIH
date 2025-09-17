// Mock blockchain service
export class BlockchainService {
  private mockTransactions: any[] = [];

  async createConsentContract(patientId: string, doctorId: string, recordIds: string[]): Promise<string> {
    const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    const transaction = {
      id: Date.now().toString(),
      type: 'consent_contract',
      contractAddress,
      patientId,
      doctorId,
      recordIds,
      timestamp: new Date().toISOString(),
      gasUsed: Math.floor(Math.random() * 100000) + 50000,
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000
    };
    
    this.mockTransactions.push(transaction);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return contractAddress;
  }

  async grantConsent(contractAddress: string, patientWallet: string): Promise<string> {
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    const transaction = {
      id: Date.now().toString(),
      type: 'grant_consent',
      txHash,
      contractAddress,
      wallet: patientWallet,
      timestamp: new Date().toISOString(),
      gasUsed: Math.floor(Math.random() * 50000) + 25000,
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000
    };
    
    this.mockTransactions.push(transaction);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return txHash;
  }

  async revokeConsent(contractAddress: string, patientWallet: string): Promise<string> {
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    const transaction = {
      id: Date.now().toString(),
      type: 'revoke_consent',
      txHash,
      contractAddress,
      wallet: patientWallet,
      timestamp: new Date().toISOString(),
      gasUsed: Math.floor(Math.random() * 50000) + 25000,
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000
    };
    
    this.mockTransactions.push(transaction);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return txHash;
  }

  async storeRecordHash(recordId: string, ipfsHash: string, patientWallet: string): Promise<string> {
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    const transaction = {
      id: Date.now().toString(),
      type: 'store_record',
      txHash,
      recordId,
      ipfsHash,
      wallet: patientWallet,
      timestamp: new Date().toISOString(),
      gasUsed: Math.floor(Math.random() * 75000) + 35000,
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000
    };
    
    this.mockTransactions.push(transaction);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return txHash;
  }

  getTransactionHistory(walletAddress: string): any[] {
    return this.mockTransactions.filter(tx => 
      tx.wallet === walletAddress || 
      tx.patientWallet === walletAddress ||
      tx.doctorWallet === walletAddress
    );
  }

  async emergencyOverride(officerId: string, patientId: string, reason: string): Promise<string> {
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    const transaction = {
      id: Date.now().toString(),
      type: 'emergency_override',
      txHash,
      officerId,
      patientId,
      reason,
      timestamp: new Date().toISOString(),
      gasUsed: Math.floor(Math.random() * 100000) + 75000,
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
      approved: true
    };
    
    this.mockTransactions.push(transaction);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    return txHash;
  }
}

export const blockchainService = new BlockchainService();