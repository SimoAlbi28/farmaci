import { useState, useEffect } from 'react'
import {
  getFolder,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from '../utils/storage'
import MedicineCard from './MedicineCard'
import MedicineModal from './MedicineModal'
import ConfirmModal from './ConfirmModal'

export default function FolderPage({ folderId, onBack }) {
  const [folder, setFolder] = useState(null)
  const [showMedModal, setShowMedModal] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [search, setSearch] = useState('')

  const reload = () => setFolder(getFolder(folderId))

  useEffect(() => {
    reload()
  }, [folderId])

  if (!folder) return null

  const query = search.trim().toLowerCase()

  const filteredMedicines = folder.medicines.filter(med => {
    if (!query) return true
    const nameMatch = med.name.toLowerCase().includes(query)
    const dateMatch = new Date(med.expiry).toLocaleDateString('it-IT').includes(query)
    return nameMatch || dateMatch
  })

  const sortedMedicines = [...filteredMedicines].sort(
    (a, b) => new Date(a.expiry) - new Date(b.expiry)
  )

  const handleAddMedicine = (data) => {
    addMedicine(folderId, data)
    reload()
    setShowMedModal(false)
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
      <header className="page-header">
        <button className="btn-back" onClick={onBack}>
          ← Indietro
        </button>
        <h1>{folder.name}</h1>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Cerca per nome o data (es. 15/04/2026)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoComplete="off"
        />
      </div>

      <h2 className="section-title">Riepilogo Farmaci</h2>

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

      <button className="fab" onClick={() => setShowMedModal(true)} title="Aggiungi farmaco">
        +
      </button>

      {showMedModal && (
        <MedicineModal
          onSave={handleAddMedicine}
          onClose={() => setShowMedModal(false)}
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
