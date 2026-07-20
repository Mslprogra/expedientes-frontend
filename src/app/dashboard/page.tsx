'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Definimos la estructura (tipo de datos) de nuestro Estudiante
interface Estudiante {
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
  correo: string;
  titulo: string;
  notas: string;
  cedula_foto: string;
}

export default function DashboardPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Estado para el rol
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Leemos de la memoria si es admin y convertimos ese texto a booleano de forma correcta
    const adminStatus = localStorage.getItem('isAdmin') === 'true'; 
    setIsAdmin(adminStatus);

    // Si no hay llave, significa que no ha iniciado sesión, lo mandamos al Login
    if (!token) {
      router.push('/login');
      return;
    }

    // Pedimos la lista de estudiantes enviando la llave digital
    const fetchEstudiantes = async () => {
      try {
        const response = await fetch('https://expedientes-upt.onrender.com/api/estudiantes/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEstudiantes(data);
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
          router.push('/login');
        } else {
          setError('Error al cargar los datos.');
        }
      } catch (err) {
        setError('No se pudo conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, [router]);

  // FUNCIÓN PARA ELIMINAR EL EXPEDIENTE DESDE EL FRONTEND
  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás completamente seguro de eliminar este expediente?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://expedientes-upt.onrender.com/api/estudiantes/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        // Filtramos el estado para quitar al estudiante borrado de la pantalla inmediatamente
        setEstudiantes(estudiantes.filter(est => est.id !== id));
      } else {
        alert('No tienes permisos suficientes para realizar esta acción.');
      }
    } catch (err) {
      alert('Ocurrió un error al intentar conectar con el servidor.');
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-600">Cargando expedientes...</p>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Cabecera del panel */}
        <div className="flex items-center justify-between border-b pb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expedientes Estudiantiles</h1>
            <p className="text-sm text-gray-500">U.P.T.A.I.E.T. - Personal Administrativo</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* ESTE BOTÓN SOLO LO VERÁ EL ADMINISTRADOR */}
            {isAdmin && (
              <button
                onClick={() => router.push('/register')}
                className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 shadow-sm transition-colors"
              >
                + Registrar Personal
              </button>
            )}

            <button
              onClick={() => router.push('/dashboard/nuevo')}
              className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm"
            >
              + Nuevo Estudiante
            </button>
            
            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Tabla de Estudiantes */}
        <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Cédula</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nombre Completo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Correo Electrónico</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Documentos</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {estudiantes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                    No hay estudiantes registrados actualmente.
                  </td>
                </tr>
              ) : (
                estudiantes.map((estudiante) => (
                  <tr key={estudiante.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{estudiante.cedula}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {estudiante.nombre} {estudiante.apellido}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{estudiante.correo}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {estudiante.titulo && (
                          <a href={estudiante.titulo} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900 font-semibold mr-2">
                            Título (PDF)
                          </a>
                        )}
                        {estudiante.notas && (
                          <a href={estudiante.notas} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900 font-semibold mr-2">
                            Notas (PDF)
                          </a>
                        )}
                        {estudiante.cedula_foto && (
                          <a href={estudiante.cedula_foto} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900 font-semibold">
                            Foto Cédula
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/dashboard/editar/${estudiante.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                        >
                          Editar
                        </button>
                        
                        {isAdmin && (
                          <button
                            onClick={() => handleEliminar(estudiante.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}