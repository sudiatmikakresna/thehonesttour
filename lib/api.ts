import axios from 'axios';

// API Configuration
const API_BASE_URL = 'https://api.thehonesttour.com/api';
const API_TOKEN = 'f84ab428034ccbe4a176bd8d75bfbdd07cd5327ea2681a3740b0448ad44cb3dba49bb89aafefb383b0345cba68a175cd263767346fcc2fe4712460d107a6aa96ffb6a43a08f2c636d463a58e5bbbba2a8c252bef104d3151cb20e460bcabd24d77b211cefcd83b3e53b73a9d8685fe1815f464a00ef2baa26637afff59070925';

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export default apiClient;