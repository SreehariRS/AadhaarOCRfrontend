import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    console.log('API route called');
    
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    console.log('Backend URL:', backendUrl);
    
    // First, test if backend is reachable
    try {
      const healthCheck = await axios.get(`${backendUrl}/health`, { timeout: 5000 });
      console.log('Backend health check:', healthCheck.data);
    } catch (healthError: any) {
      console.error('Backend health check failed:', healthError.message);
      
      if (healthError.code === 'ECONNREFUSED') {
        return NextResponse.json({ 
          error: 'Backend server is not running on port 5000. Please start the backend server with: cd backend && npm run dev' 
        }, { status: 503 });
      }
      
      return NextResponse.json({ 
        error: `Cannot connect to backend server at ${backendUrl}. Error: ${healthError.message}` 
      }, { status: 503 });
    }
    
    const formData = await req.formData();
    console.log('FormData received, sending to backend...');
    
    const response = await axios.post(`${backendUrl}/api/ocr/process`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout
    });
    
    console.log('Backend response received:', response.data);
    return NextResponse.json(response.data);
    
  } catch (error: any) {
    console.error('API route error:', error);
    
    if (error.response) {
      console.error('Backend error response:', error.response.data);
      return NextResponse.json({ 
        error: error.response.data?.error || 'Backend processing failed',
        details: error.response.data
      }, { status: error.response.status });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json({ 
        error: 'Backend server is not running. Please start the backend server.' 
      }, { status: 503 });
    }
    
    if (error.code === 'ENOTFOUND') {
      return NextResponse.json({ 
        error: 'Cannot connect to backend server. Check BACKEND_URL configuration.' 
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to process images. Please try again.',
      details: error.message
    }, { status: 500 });
  }
}