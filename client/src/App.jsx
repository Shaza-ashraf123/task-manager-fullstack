import { useEffect, useState } from 'react';
import api from './api';

export default function App() {
  const [status, setStatus] = useState('loading...');

  useEffect(() => {
    api
      .get('/health')
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus('error'));
  }, []);

  return <h1>API status: {status}</h1>;
}