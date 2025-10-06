import { refreshAccessToken } from './auth';

const API_PREFIX = '/api';
//https://dvakrat.bezsody.cz/api/formation/special/warehouse/pas 
export async function fetchWithAuth(endpoint, options = {}) {
  const accessToken = localStorage.getItem('accessToken');

  const response = await fetch(`${API_PREFIX}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return fetchWithAuth(endpoint, options);
    else throw new Error('Unauthorized – login again');
  }

  return response;
}
