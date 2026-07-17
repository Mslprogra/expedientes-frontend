'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NuevoEstudiantePage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados para los campos de texto
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');

  // Estados para los archivos físicos
  const [titulo, setTitulo] = useState<File | null>(null);
  const [notas, setNotas] = useState<File | null>(null);
  const [cedulaFoto, setCedulaFoto] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Usamos FormData porque vamos a enviar archivos físicos (PDF / Fotos)
    const formData = new FormData();
    formData.append('cedula', cedula);
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('correo', correo);

    if (titulo) formData.append('titulo', titulo);
    if (notas) formData.append('notas', notas);
    if (cedulaFoto) formData.append('cedula_foto', cedulaFoto);

    try {
      const response = await fetch('https://expedientes-upt.onrender.com/api/estudiantes/', {
        method: 'POST',
        headers: {
          // NOTA: Con FormData NO se coloca 'Content-Type': 'application/json'. 
          // El navegador se encarga de definirlo automáticamente como 'multipart/form-data'.
          'Authorization': `Token ${token}`,
          
        },
        body: formData,
      });

      if (response.ok) {
        // Si todo sale bien, regresamos al dashboard para ver el nuevo registro
        router.push('/dashboard');
      } else {
        const errData = await response.json();
        setError(JSON.stringify(errData) || 'Ocurrió un error al guardar el expediente.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nuevo Expediente Estudiantil</h1>
        <p className="text-sm text-gray-500 mb-6">Completa los datos del estudiante y adjunta sus documentos probatorios.</p>

        {error && (
          <div className="mb-6 rounded bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fila de Cédula */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Cédula de Identidad</label>
            <input
              type="text"
              required
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              placeholder="V-12345678"
            />
          </div>

          {/* Fila de Nombres y Apellidos */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Nombres</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Apellidos</label>
              <input
                type="text"
                required
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              placeholder="estudiante@uptaiet.edu.ve"
            />
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Subida de Archivos */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-800">Carga de Documentación Física</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">Título de Bachiller (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setTitulo(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Certificación de Notas (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setNotas(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Foto legible de la Cédula (Imagen)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCedulaFoto(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Guardando expediente...' : 'Guardar Expediente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}