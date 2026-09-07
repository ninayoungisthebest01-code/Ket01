'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { removeEmployee, saveEmployee } from '@/app/actions/employees'
import type { Employee } from '@/lib/db/schema'

export function EmployeeManager({ initialEmployees }: { initialEmployees: Employee[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<Partial<Employee> | null>(null)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  function startNew() { setEditing({ username: '', name: '', email: '', role: 'staff', status: 'active' }); setMessage('') }
  function startEdit(employee: Employee) { setEditing(employee); setMessage('') }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!editing) return
    setSaving(true); setMessage('')
    const form = new FormData(event.currentTarget)
    try {
      await saveEmployee({ id: editing.id, username: String(form.get('username')), name: String(form.get('name')), email: String(form.get('email')), role: String(form.get('role')), status: String(form.get('status')), password: String(form.get('password') || '') })
      setEditing(null); setMessage('Cambios guardados correctamente.'); router.refresh()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudo guardar el registro.') }
    finally { setSaving(false) }
  }
  async function deactivate(id: string) { if (!confirm('¿Desactivar este acceso?')) return; await saveEmployee({ ...initialEmployees.find(item => item.id === id)!, id, status: 'inactive' }); router.refresh() }
  async function deleteInactive(id: string) { if (!confirm('¿Eliminar definitivamente este registro?')) return; await removeEmployee(id); router.refresh() }

  return <section className="admin-data-card" aria-labelledby="employees-title">
    <div className="admin-data-heading"><div><p className="eyebrow">Accesos del equipo</p><h2 id="employees-title">Personal y permisos</h2><p>Agrega empleados y edita sus datos sin tocar los identificadores internos de autenticación.</p></div><button className="primary-btn" type="button" onClick={startNew}>Agregar empleado</button></div>
    {message && <p className="admin-feedback" role="status">{message}</p>}
    {editing && <form className="employee-form" onSubmit={submit}><div className="employee-form-grid"><label>Usuario<input name="username" defaultValue={editing.username} required /></label><label>Nombre<input name="name" defaultValue={editing.name} required /></label><label>Correo<input name="email" type="email" defaultValue={editing.email} required /></label>{!editing.id && <label>Contraseña temporal<input name="password" type="password" minLength={8} required /></label>}<label>Rol<select name="role" defaultValue={editing.role || 'staff'}><option value="staff">Personal</option><option value="manager">Gerencia</option><option value="admin">Administrador</option></select></label><label>Estado<select name="status" defaultValue={editing.status || 'active'}><option value="active">Activo</option><option value="inactive">Inactivo</option></select></label></div><div className="employee-actions"><button className="primary-btn" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button><button className="secondary-btn" type="button" onClick={() => setEditing(null)}>Cancelar</button></div></form>}
    <div className="employee-table-wrap"><table className="employee-table"><thead><tr><th>ID interno</th><th>Usuario</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{initialEmployees.map(employee => <tr key={employee.id}><td><code title="Identificador estable de autenticación">{employee.id}</code></td><td>{employee.username}</td><td>{employee.name}</td><td>{employee.email}</td><td>{employee.role}</td><td><span className={`status-pill ${employee.status}`}>{employee.status === 'active' ? 'Activo' : 'Inactivo'}</span></td><td><button className="table-action" onClick={() => startEdit(employee)}>Editar</button>{employee.status === 'active' ? <button className="table-action danger" onClick={() => deactivate(employee.id)}>Desactivar</button> : <button className="table-action danger" onClick={() => deleteInactive(employee.id)}>Eliminar</button>}</td></tr>)}</tbody></table>{initialEmployees.length === 0 && <p className="empty-table">Aún no hay empleados registrados. Agrega el primer acceso desde aquí.</p>}</div>
    <p className="data-note">Los IDs internos se mantienen estables porque están relacionados con sesiones y cuentas. Edita usuario, correo, rol y estado desde este panel.</p>
  </section>
}
