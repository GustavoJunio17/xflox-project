import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('senha123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useContext(AuthContext);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/v1/auth/login', { email, password });
      if (res.data && res.data.token) {
        login(res.data.token);
      } else {
        setError('Resposta inválida do servidor');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto bg-white shadow rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Entrar no XFlow</h2>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <label className="block mb-2 text-sm">Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" />
      <label className="block mb-2 text-sm">Senha</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2 mb-4" />
      <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
