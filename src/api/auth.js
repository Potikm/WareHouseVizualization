const API_PREFIX = '/api'; // vracíme zpět /api/
const USERNAME = import.meta.env.VITE_K2_USERNAME;
const PASSWORD = import.meta.env.VITE_K2_PASSWORD;

export async function login() {
  const response = await fetch(`${API_PREFIX}/token/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });

  if (!response.ok) {
    const text = await response.text(); // pro debug
    console.error('Login failed:', response.status, text);
    throw new Error('Login failed');
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);

  return data;
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  const response = await fetch(`${API_PREFIX}/token/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return false;
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return true;
}
