'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditarEstudiantePage({ params }: PageProps) {
  const router = useRouter();
  // Desenvolvemos los parámetros de la URL usando React.use()
  const { id } = use(params);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados del formulario
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');

  // Archivos existentes (URLs del backend)
  const [tituloUrl, setTituloUrl] = useState('');
  const [notasUrl, setNotasUrl] = useState('');
  const [cedulaFotoUrl, setCedulaFotoUrl] = useState('');

  // Nuevos archivos seleccionados por el usuario
  const [nuevoTitulo, setNuevoTitulo] = useState<File | null>(null);
  const [nuevasNotas, setNuevasNotas] = useState<File | null>(null);
  const [nuevaCedulaFoto, setNuevaCedulaFoto] = useState<File | null>(null);

  // Cargar los datos actuales del estudiante
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const cargarEstudiante = async () => {
      try {
        const response = await fetch(`https://expedientes-upt.onrender.com/api/estudiantes/${id}/`, {
          headers: {
            'Authorization': `Token ${token}`,
            
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCedula(data.cedula);
          setNombre(data.nombre);
          setApellido(data.apellido);
          setCorreo(data.correo);
          // Guardamos las URLs de los archivos que ya están en el servidor
          setTituloUrl(data.titulo || '');
          setNotasUrl(data.notas || '');
          setCedulaFotoUrl(data.cedula_foto || '');
        } else {
          setError('No se pudo obtener la información del expediente.');
        }
      } catch (err) {
        setError('Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    cargarEstudiante();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const token = localStorage.getItem('token');
    if (!token) return;

    const formData = new FormData();
    formData.append('cedula', cedula);
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('correo', correo);

    // Solo adjuntamos los archivos si el usuario seleccionó unos nuevos
    if (nuevoTitulo) formData.append('titulo', nuevoTitulo);
    if (nuevasNotas) formData.append('notas', nuevasNotas);
    if (nuevaCedulaFoto) formData.append('cedula_foto', nuevaCedulaFoto);

    try {
      // Usamos PUT para actualizar todo el recurso, enviando el ID en la URL
      const response = await fetch(`http://127.0.0.1:8000/api/estudiantes/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const errData = await response.json();
        setError(JSON.stringify(errData) || 'Error al actualizar el expediente.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-600">Cargando datos del expediente...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Editar Expediente</h1>
        <p className="text-sm text-gray-500 mb-6">Modifica la información del estudiante y actualiza sus documentos si es necesario.</p>

        {error && (
          <div className="mb-6 rounded bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Cédula de Identidad</label>
            <input
              type="text"
              required
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Nombres</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Apellidos</label>
              <input
                type="text"
                required
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Actualización de Documentos */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-800">Actualizar Documentación</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título de Bachiller (PDF) {tituloUrl && <span className="text-green-600 font-normal">(Ya cargado)</span>}
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setNuevoTitulo(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Certificación de Notas (PDF) {notasUrl && <span className="text-green-600 font-normal">(Ya cargado)</span>}
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setNuevasNotas(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Foto de la Cédula {cedulaFotoUrl && <span className="text-green-600 font-normal">(Ya cargada)</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNuevaCedulaFoto(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-400"
            >
              {saving ? 'Guardando cambios...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}