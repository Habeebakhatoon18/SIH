import CryptoJS from 'crypto-js';

// Mock IPFS service
export class IPFSService {
  private mockStorage: Map<string, any> = new Map();

  async uploadFile(file: File, encryptionKey: string): Promise<string> {
    const fileContent = await this.fileToBase64(file);
    
    // Encrypt the content
    const encrypted = CryptoJS.AES.encrypt(fileContent, encryptionKey).toString();
    
    // Generate mock IPFS hash
    const ipfsHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
    
    // Store in mock storage
    this.mockStorage.set(ipfsHash, {
      content: encrypted,
      originalName: file.name,
      contentType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString()
    });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return ipfsHash;
  }

  async uploadJSON(data: any, encryptionKey: string): Promise<string> {
    const jsonString = JSON.stringify(data);
    
    // Encrypt the JSON
    const encrypted = CryptoJS.AES.encrypt(jsonString, encryptionKey).toString();
    
    // Generate mock IPFS hash
    const ipfsHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
    
    // Store in mock storage
    this.mockStorage.set(ipfsHash, {
      content: encrypted,
      originalName: 'data.json',
      contentType: 'application/json',
      size: jsonString.length,
      uploadedAt: new Date().toISOString()
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return ipfsHash;
  }

  async retrieveFile(ipfsHash: string, encryptionKey: string): Promise<any> {
    const stored = this.mockStorage.get(ipfsHash);
    
    if (!stored) {
      throw new Error('File not found');
    }
    
    try {
      // Decrypt the content
      const decrypted = CryptoJS.AES.decrypt(stored.content, encryptionKey).toString(CryptoJS.enc.Utf8);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        content: decrypted,
        originalName: stored.originalName,
        contentType: stored.contentType,
        size: stored.size,
        uploadedAt: stored.uploadedAt
      };
    } catch (error) {
      throw new Error('Decryption failed - invalid key');
    }
  }

  async retrieveJSON(ipfsHash: string, encryptionKey: string): Promise<any> {
    const file = await this.retrieveFile(ipfsHash, encryptionKey);
    return JSON.parse(file.content);
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  async pinFile(ipfsHash: string): Promise<boolean> {
    // Mock pinning service
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  getStorageStats(): { totalFiles: number, totalSize: number } {
    let totalSize = 0;
    this.mockStorage.forEach(item => totalSize += item.size);
    
    return {
      totalFiles: this.mockStorage.size,
      totalSize
    };
  }
}

export const ipfsService = new IPFSService();