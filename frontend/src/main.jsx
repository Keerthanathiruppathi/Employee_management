import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  Edit3,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import './styles.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const EMPTY_FORM = { name: '', email: '', phone: '', department: '', salary: '' }
const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Operations', 'Finance', 'People']

function initials(name) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}

function formatSalary(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function App() {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All departments')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')

  async function loadEmployees() {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/employees/`)
      if (!response.ok) throw new Error('Unable to load employees.')
      setEmployees(await response.json())
    } catch (requestError) {
      setError(`${requestError.message} Check that the FastAPI server and database are running.`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadEmployees() }, [])

  const filteredEmployees = useMemo(() => employees.filter((employee) => {
    const query = search.toLowerCase()
    const matchesSearch = [employee.name, employee.email, employee.department].some((value) => value.toLowerCase().includes(query))
    return matchesSearch && (department === 'All departments' || employee.department === department)
  }), [employees, search, department])

  const departmentCount = new Set(employees.map((employee) => employee.department)).size
  const payroll = employees.reduce((total, employee) => total + Number(employee.salary), 0)

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }

  async function saveEmployee(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload = {
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim() || null,
      department: formData.get('department'),
      salary: Number(formData.get('salary')),
    }
    const isEditing = modal?.mode === 'edit'
    try {
      const response = await fetch(`${API_URL}/employees${isEditing ? `/${modal.employee.id}` : '/'}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.detail || 'Unable to save employee.')
      setModal(null)
      await loadEmployees()
      notify(isEditing ? 'Employee details updated' : 'Employee added to the directory')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function removeEmployee(employee) {
    if (!window.confirm(`Remove ${employee.name} from the directory?`)) return
    try {
      const response = await fetch(`${API_URL}/employees/${employee.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Unable to remove employee.')
      setEmployees((current) => current.filter((item) => item.id !== employee.id))
      notify(`${employee.name} was removed`)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Users size={19} /></span><span>peopleboard</span></div>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a className="nav-item active" href="#directory"><Users size={18} /> Directory <span className="nav-count">{employees.length}</span></a>
          <a className="nav-item" href="#departments"><Building2 size={18} /> Departments</a>
          <a className="nav-item" href="#reports"><BriefcaseBusiness size={18} /> Reports</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="workspace-label">Workspace</div>
          <div className="workspace-switcher"><span className="workspace-avatar">AC</span><span><strong>Acme Co.</strong><small>People ops</small></span><ChevronDown size={15} /></div>
          <div className="user-profile"><span className="profile-avatar">JD</span><span><strong>Jordan Davis</strong><small>Administrator</small></span><MoreHorizontal size={17} /></div>
        </div>
      </aside>

      <main className="main-content" id="directory">
        <header className="topbar"><div className="breadcrumb">People <span>/</span> Directory</div><div className="topbar-actions"><span className="status-dot"><i /> All systems operational</span><button className="icon-button" aria-label="Open notifications"><CircleAlert size={18} /></button></div></header>
        <section className="page-header"><div><p className="eyebrow">People operations <ArrowUpRight size={14} /></p><h1>Team directory</h1><p className="subtitle">A clear view of the people making Acme move.</p></div><button className="primary-button" onClick={() => setModal({ mode: 'create', employee: null })}><Plus size={18} /> Add employee</button></section>

        {error && <div className="error-banner"><CircleAlert size={18} /><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss error"><X size={16} /></button></div>}

        <section className="stats-grid" aria-label="Directory overview">
          <article className="stat-card stat-card-dark"><div className="stat-label">Total employees <Users size={16} /></div><strong>{employees.length}</strong><span className="stat-note"><span className="positive"><ArrowUpRight size={14} /> 12%</span> vs last month</span></article>
          <article className="stat-card"><div className="stat-label">Departments <Building2 size={16} /></div><strong>{departmentCount}</strong><span className="stat-note">Across the organization</span></article>
          <article className="stat-card"><div className="stat-label">Monthly payroll <BriefcaseBusiness size={16} /></div><strong>{formatSalary(payroll / 12)}</strong><span className="stat-note">Based on annual salaries</span></article>
        </section>

        <section className="directory-panel">
          <div className="panel-heading"><div><h2>All employees <span>{filteredEmployees.length}</span></h2><p>Manage your team details and contact information.</p></div><button className="secondary-button" onClick={loadEmployees}>Refresh data</button></div>
          <div className="toolbar"><label className="search-field"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, email or department" /></label><label className="select-field"><select value={department} onChange={(event) => setDepartment(event.target.value)}><option>All departments</option>{DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></label></div>
          <div className="table-wrap">
            <table><thead><tr><th>Employee</th><th>Department</th><th>Contact</th><th>Salary</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{isLoading ? <tr><td colSpan="5" className="empty-state">Loading your directory...</td></tr> : filteredEmployees.length === 0 ? <tr><td colSpan="5" className="empty-state"><Users size={27} /><strong>{employees.length ? 'No matching employees' : 'Your directory is waiting'}</strong><span>{employees.length ? 'Try a different search or department.' : 'Add your first employee to get started.'}</span></td></tr> : filteredEmployees.map((employee) => <tr key={employee.id}><td><div className="employee-cell"><span className="avatar">{initials(employee.name)}</span><span><strong>{employee.name}</strong><small>Added {new Date(employee.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</small></span></div></td><td><span className="department-pill">{employee.department}</span></td><td><a className="email-link" href={`mailto:${employee.email}`}><Mail size={14} />{employee.email}</a>{employee.phone && <small className="phone">{employee.phone}</small>}</td><td className="salary-cell">{formatSalary(employee.salary)}<small>annual</small></td><td><div className="row-actions"><button className="row-button" onClick={() => setModal({ mode: 'edit', employee })} aria-label={`Edit ${employee.name}`}><Edit3 size={16} /></button><button className="row-button danger" onClick={() => removeEmployee(employee)} aria-label={`Delete ${employee.name}`}><Trash2 size={16} /></button></div></td></tr>)}</tbody>
            </table>
          </div>
        </section>
        <footer className="page-footer"><span>Showing {filteredEmployees.length} of {employees.length} employees</span><span>Peopleboard <span className="footer-dot">&middot;</span> 2026</span></footer>
      </main>

      {modal && <EmployeeModal mode={modal.mode} employee={modal.employee} onClose={() => setModal(null)} onSubmit={saveEmployee} />}
      {toast && <div className="toast"><span><Check size={15} /></span>{toast}</div>}
    </div>
  )
}

function EmployeeModal({ mode, employee, onClose, onSubmit }) {
  const values = employee || EMPTY_FORM
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><p className="eyebrow">Directory record</p><h2 id="modal-title">{mode === 'edit' ? 'Edit employee' : 'Add employee'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div><form onSubmit={onSubmit}><div className="form-grid"><label>Full name<input required name="name" defaultValue={values.name} placeholder="e.g. Alex Morgan" /></label><label>Email address<input required type="email" name="email" defaultValue={values.email} placeholder="alex@acme.com" /></label><label>Phone number<input name="phone" defaultValue={values.phone || ''} placeholder="+1 555 000 0000" /></label><label>Department<select required name="department" defaultValue={values.department || ''}><option value="" disabled>Select department</option>{DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select></label><label className="salary-input">Annual salary<div className="currency-input"><span>$</span><input required min="1" step="0.01" type="number" name="salary" defaultValue={values.salary || ''} placeholder="85000" /></div></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">{mode === 'edit' ? 'Save changes' : 'Add employee'} <ArrowUpRight size={17} /></button></div></form></section></div>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
