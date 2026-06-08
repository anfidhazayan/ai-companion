import axios from 'axios';

// Get backend URL from storage or default to http://localhost:8000
export const getBackendUrl = () => {
  return localStorage.getItem('backend_url') || 'http://localhost:8000';
};

export const setBackendUrl = (url) => {
  localStorage.setItem('backend_url', url.trim().replace(/\/$/, ""));
};

// Create a function that returns an axios instance with the current base URL
const getClient = () => {
  return axios.create({
    baseURL: getBackendUrl(),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const api = {
  // Check backend status / home
  checkBackend: async () => {
    const response = await getClient().get('/');
    return response.data;
  },

  // Upload PDF file
  uploadPdf: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const client = getClient();
    const response = await client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        } else if (onUploadProgress) {
          // If total is not available, mock progress increments
          onUploadProgress(50);
        }
      }
    });
    return response.data;
  },

  // Ask question (chat)
  askQuestion: async (question) => {
    const client = getClient();
    const response = await client.post('/chat', { question });
    return response.data;
  },

  // Fetch memory facts
  getMemory: async () => {
    const client = getClient();
    const response = await client.get('/memory');
    return response.data;
  },

  // Fetch upload status
  getStatus: async () => {
    const client = getClient();
    const response = await client.get('/status');
    return response.data;
  }
};
