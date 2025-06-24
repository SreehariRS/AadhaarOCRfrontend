import axiosClient from '../lib/axiosClient';

export class ApiService {
  static async uploadImages(frontFile: File, backFile: File): Promise<any> {
    const formData = new FormData();
    formData.append('front', frontFile);
    formData.append('back', backFile);

    try {
      const response = await axiosClient.post('/api/ocr/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error; // Let the caller handle the error
    }
  }

  static async checkBackendHealth(): Promise<any> {
    try {
      const response = await axiosClient.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}