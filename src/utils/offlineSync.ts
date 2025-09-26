import { OfflineAction } from '../contexts/AppContext';

class OfflineSyncManager {
  private storageKey = 'healthcare_offline_actions';
  
  saveOfflineAction(action: OfflineAction): void {
    const existingActions = this.getOfflineActions();
    existingActions.push(action);
    localStorage.setItem(this.storageKey, JSON.stringify(existingActions));
  }
  
  getOfflineActions(): OfflineAction[] {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored).map((action: any) => ({
        ...action,
        timestamp: new Date(action.timestamp)
      }));
    } catch {
      return [];
    }
  }
  
  markActionsSynced(actionIds: string[]): void {
    const actions = this.getOfflineActions();
    const updated = actions.filter(action => !actionIds.includes(action.id));
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }
  
  async syncOfflineActions(
    onProgress?: (progress: number) => void
  ): Promise<string[]> {
    const actions = this.getOfflineActions();
    const syncedIds: string[] = [];
    
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      
      try {
        // Simulate API call - replace with actual sync logic
        await this.mockApiSync(action);
        syncedIds.push(action.id);
        
        if (onProgress) {
          onProgress(((i + 1) / actions.length) * 100);
        }
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Failed to sync action:', action.id, error);
      }
    }
    
    this.markActionsSynced(syncedIds);
    return syncedIds;
  }
  
  private async mockApiSync(action: OfflineAction): Promise<void> {
    // Simulate network request
    return new Promise((resolve, reject) => {
      const success = Math.random() > 0.1; // 90% success rate
      setTimeout(() => {
        if (success) {
          resolve();
        } else {
          reject(new Error('Network error'));
        }
      }, Math.random() * 500 + 200);
    });
  }
  
  clearOfflineData(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const offlineSyncManager = new OfflineSyncManager();