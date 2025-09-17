// Mock AI service for health data processing
export class AIService {
  async analyzeHealthDocument(content: string): Promise<{
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high';
    confidence: number;
  }> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock analysis based on content keywords
    const keyFindings = this.extractKeyFindings(content);
    const riskLevel = this.assessRiskLevel(content);
    const recommendations = this.generateRecommendations(content, riskLevel);
    
    return {
      summary: this.generateSummary(content, keyFindings),
      keyFindings,
      recommendations,
      riskLevel,
      confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
    };
  }

  async ocrScan(imageData: string): Promise<string> {
    // Mock OCR processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Return mock extracted text
    return `Patient: John Doe
Date: ${new Date().toLocaleDateString()}
Diagnosis: Hypertension
Blood Pressure: 140/90 mmHg
Pulse: 78 bpm
Temperature: 98.6°F
Prescription:
- Amlodipine 5mg once daily
- Lisinopril 10mg once daily
Follow-up: 2 weeks

Doctor's Notes:
Patient shows signs of mild hypertension. 
Lifestyle modifications recommended including 
diet control and regular exercise.`;
  }

  async generateHealthSummary(records: any[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const recordCount = records.length;
    const recentRecord = records[0];
    
    return `Health Summary (${recordCount} records analyzed):

Recent Activity: ${recentRecord?.type || 'consultation'} on ${new Date().toLocaleDateString()}

Key Health Indicators:
• Blood pressure monitoring required
• Medication compliance good
• No critical alerts detected

Recommendations:
• Continue current medication regimen
• Schedule follow-up in 4 weeks
• Monitor blood pressure weekly

Overall Health Score: 7.5/10
Risk Assessment: Low to Moderate`;
  }

  private extractKeyFindings(content: string): string[] {
    const findings = [];
    
    if (content.toLowerCase().includes('blood pressure') || content.toLowerCase().includes('hypertension')) {
      findings.push('Elevated blood pressure detected');
    }
    if (content.toLowerCase().includes('diabetes') || content.toLowerCase().includes('glucose')) {
      findings.push('Diabetes management required');
    }
    if (content.toLowerCase().includes('fever') || content.toLowerCase().includes('temperature')) {
      findings.push('Temperature abnormality noted');
    }
    if (content.toLowerCase().includes('medication') || content.toLowerCase().includes('prescription')) {
      findings.push('Active medication regimen');
    }
    
    return findings.length > 0 ? findings : ['Routine health assessment'];
  }

  private assessRiskLevel(content: string): 'low' | 'medium' | 'high' {
    const highRiskKeywords = ['emergency', 'critical', 'urgent', 'severe', 'acute'];
    const mediumRiskKeywords = ['moderate', 'elevated', 'abnormal', 'concerning'];
    
    const contentLower = content.toLowerCase();
    
    if (highRiskKeywords.some(keyword => contentLower.includes(keyword))) {
      return 'high';
    }
    if (mediumRiskKeywords.some(keyword => contentLower.includes(keyword))) {
      return 'medium';
    }
    return 'low';
  }

  private generateRecommendations(content: string, riskLevel: string): string[] {
    const recommendations = [];
    
    if (riskLevel === 'high') {
      recommendations.push('Immediate medical attention required');
      recommendations.push('Monitor vital signs closely');
    } else if (riskLevel === 'medium') {
      recommendations.push('Follow-up consultation recommended');
      recommendations.push('Continue prescribed treatment');
    } else {
      recommendations.push('Maintain current health regimen');
      recommendations.push('Regular check-ups as scheduled');
    }
    
    if (content.toLowerCase().includes('blood pressure')) {
      recommendations.push('Monitor blood pressure regularly');
    }
    if (content.toLowerCase().includes('medication')) {
      recommendations.push('Ensure medication compliance');
    }
    
    return recommendations;
  }

  private generateSummary(content: string, keyFindings: string[]): string {
    const wordCount = content.split(' ').length;
    return `Analysis of ${wordCount} word medical document reveals ${keyFindings.length} significant finding(s). Document contains standard medical consultation information with routine assessments and treatment plans.`;
  }
}

export const aiService = new AIService();