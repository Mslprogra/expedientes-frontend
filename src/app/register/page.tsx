'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Ajusta esta URL a tu endpoint de registro en Django
      const response = await fetch('https://expedientes-upt.onrender.com/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.detail || 'Error al registrar el usuario. Intente con otro nombre o correo.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Registro de Personal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Crea una cuenta para el control de expedientes de la U.P.T.A.I.E.T.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
            ¡Registro exitoso! Redirigiendo al login...
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition-colors"
          >
            Registrarse
          </button>
        </form>

        <div className="text-center text-sm">
          <button onClick={() => router.push('/login')} className="text-indigo-600 hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}