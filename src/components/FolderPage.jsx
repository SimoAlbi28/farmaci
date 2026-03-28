import { useState, useEffect } from 'react'
import {
  getFolder,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getExpiryStatus,
} from '../utils/storage'
import MedicineCard from './MedicineCard'
import MedicineModal from './MedicineModal'
import ConfirmModal from './ConfirmModal'

export default function FolderPage({ folderId, folderName }) {
  const [folder, setFolder] = useState(null)
  const [showAddMed, setShowAddMed] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [searchName, setSearchName] = useState('')
  const [searchDate, setSearchDate] = useState('')
  const [dateMode, setDateMode] = useState('all')

  const reload = () => setFolder(getFolder(folderId))

  useEffect(() => {
    reload()
  }, [folderId])

  if (!folder) return null

  const nameQuery = searchName.trim().toLowerCase()

  const filteredMedicines = folder.medicines.filter(med => {
    const nameMatch = !nameQuery || med.name.toLowerCase().includes(nameQuery)
    let dateMatch = true
    const status = getExpiryStatus(med.expiry)
    if (dateMode === 'expired') {
      dateMatch = status === 'expired'
    } else if (dateMode === 'warning') {
      dateMatch = status === 'warning' || status === 'today' || status === 'tomorrow'
    } else if (dateMode === 'ok') {
      dateMatch = status === 'ok'
    } else if (dateMode === 'before' && searchDate) {
      dateMatch = med.expiry <= searchDate
    } else if (dateMode === 'after' && searchDate) {
      dateMatch = med.expiry >= searchDate
    }
    return nameMatch && dateMatch
  })

  const sortedMedicines = [...filteredMedicines].sort(
    (a, b) => new Date(a.expiry) - new Date(b.expiry)
  )

  const handleAddMedicine = (data) => {
    addMedicine(folderId, data)
    reload()
    setShowAddMed(false)
  }

  const handleUpdateMedicine = (data) => {
    updateMedicine(folderId, editingMed.id, data)
    reload()
    setEditingMed(null)
  }

  const handleDeleteMedicine = () => {
    deleteMedicine(folderId, confirmDelete.id)
    reload()
    setConfirmDelete(null)
  }

  return (
    <div className="page">
      <h2 className="folder-page-name">{folderName}</h2>
      <div className="home-add-container">
        <button className="home-add-btn" onClick={() => setShowAddMed(true)} title="Aggiungi farmaco">+ Aggiungi farmaco</button>
      </div>

      <div className="section-divider">
        <h2 className="section-title">Cerca</h2>
      </div>

      <div className="search-bar">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Cerca per nome..."
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            autoComplete="off"
          />
          {searchName && (
            <button className="btn-clear-field" onClick={() => setSearchName('')} title="Svuota">✕</button>
          )}
        </div>
      </div>

      <h3 className="subsection-title">Filtri</h3>

      <div className="search-bar">
        <div className="input-wrapper">
          <select
            value={dateMode}
            onChange={e => { setDateMode(e.target.value); setSearchDate('') }}
            className="date-mode-select"
          >
            <option value="all">Seleziona</option>
            <option value="expired">Scaduto</option>
            <option value="warning">In scadenza</option>
            <option value="ok">Valido</option>
            <option value="before">Scade prima del</option>
            <option value="after">Scade dopo il</option>
          </select>
        </div>
        {(dateMode === 'before' || dateMode === 'after') && (
          <div className="input-wrapper">
            <input
              type="date"
              value={searchDate}
              onChange={e => setSearchDate(e.target.value)}
            />
            {searchDate && (
              <button className="btn-clear-field" onClick={() => setSearchDate('')} title="Svuota">✕</button>
            )}
          </div>
        )}
      </div>

      {(searchName || searchDate || dateMode !== 'all') && (
        <button
          className="btn-reset"
          onClick={() => { setSearchName(''); setSearchDate(''); setDateMode('all') }}
        >
          Reset
        </button>
      )}

      <div className="section-divider">
        <h2 className="section-title">Riepilogo Farmaci</h2>
      </div>

      <div className="medicines-list">
        {sortedMedicines.map(med => (
          <MedicineCard
            key={med.id}
            medicine={med}
            onEdit={() => setEditingMed(med)}
            onDelete={() => setConfirmDelete(med)}
          />
        ))}
        {sortedMedicines.length === 0 && (
          <p className="empty-message">Nessun farmaco. Aggiungine uno!</p>
        )}
      </div>

      {showAddMed && (
        <MedicineModal
          onSave={handleAddMedicine}
          onClose={() => setShowAddMed(false)}
        />
      )}

      {editingMed && (
        <MedicineModal
          initialData={editingMed}
          onSave={handleUpdateMedicine}
          onClose={() => setEditingMed(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={`Eliminare il farmaco "${confirmDelete.name}"?`}
          onConfirm={handleDeleteMedicine}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
