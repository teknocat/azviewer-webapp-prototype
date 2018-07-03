// Using React in Multiple Environments
// https://daveceddia.com/multiple-environments-with-react/
let backendHost;
const apiVersion = 'v1';

const hostname = window && window.location && window.location.hostname;

if(hostname !== 'localhost') {
  backendHost = '/azviewer/api';
} else {
  backendHost = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:10010';
}

export const API_ROOT = `${backendHost}/${apiVersion}`;