import { useState, useEffect } from 'react'
import { getFolders, createFolder, renameFolder, deleteFolder, getExpiredMedicines } from '../utils/storage'
import FolderModal from './FolderModal'
import ConfirmModal from './ConfirmModal'

export default function HomePage({ onOpenFolder }) {
  const [folders, setFolders] = useState([])
  const [expired, setExpired] = useState([])
  const [dismissed, setDismissed] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingFolder, setEditingFolder] = useState(null)
  const [deletingFolder, setDeletingFolder] = useState(null)

  const reload = () => {
    setFolders(getFolders())
    setExpired(getExpiredMedicines())
  }

  useEffect(() => {
    reload()
  }, [])

  const handleCreateFolder = (name) => {
    const folder = createFolder(name)
    if (!folder) return false
    reload()
    setShowModal(false)
    return true
  }

  const handleRenameFolder = (name) => {
    const ok = renameFolder(editingFolder.id, name)
    if (!ok) return false
    reload()
    setEditingFolder(null)
    return true
  }

  const handleDeleteFolder = () => {
    deleteFolder(deletingFolder.id)
    reload()
    setDeletingFolder(null)
  }

  const dismissNotification = (medId) => {
    setDismissed(prev => [...prev, medId])
  }

  const visibleExpired = expired.filter(m => !dismissed.includes(m.id))

  return (
    <div className="page">
      <header className="page-header home-header">
        <img src="/icon-logo.png" alt="Logo Farmaci" className="app-logo" />
        <h1>Farmaci</h1>
      </header>

      {visibleExpired.length > 0 && (
        <div className="notifications">
          {visibleExpired.map(med => (
            <div key={med.id} className="notification">
              <div className="notification-text">
                <span className="notification-icon">!</span>
                <span>
                  <strong>{med.name}</strong> nella cartella <strong>{med.folderName}</strong> è scaduto
                  {' '}({new Date(med.expiry).toLocaleDateString('it-IT')})
                </span>
              </div>
              <div className="notification-actions">
                <button
                  className="btn-link"
                  onClick={() => onOpenFolder(med.folderId)}
                >
                  Vai al farmaco
                </button>
                <button
                  className="btn-dismiss"
                  onClick={() => dismissNotification(med.id)}
                  title="Chiudi notifica"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card-grid">
        {folders.map(folder => (
          <div key={folder.id} className="folder-card">
            <div
              className="folder-card-main"
              onClick={() => onOpenFolder(folder.id)}
            >
              <img src="/medicine-icon.svg" alt="" className="folder-icon" />
              <div className="folder-name">{folder.name}</div>
              <div className="folder-count">
                {folder.medicines.length} farmac{folder.medicines.length === 1 ? 'o' : 'i'}
              </div>
            </div>
            <div className="folder-actions">
              <button
                className="btn-icon-sm"
                onClick={() => setEditingFolder(folder)}
                title="Rinomina"
              >
                ✏️
              </button>
              <button
                className="btn-icon-sm"
                onClick={() => setDeletingFolder(folder)}
                title="Elimina"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        {folders.length === 0 && (
          <p className="empty-message">Nessuna cartella. Creane una!</p>
        )}
      </div>

      <button className="fab" onClick={() => setShowModal(true)} title="Nuova cartella">
        +
      </button>

      {showModal && (
        <FolderModal
          onSave={handleCreateFolder}
          onClose={() => setShowModal(false)}
        />
      )}

      {editingFolder && (
        <FolderModal
          initialName={editingFolder.name}
          onSave={handleRenameFolder}
          onClose={() => setEditingFolder(null)}
        />
      )}

      {deletingFolder && (
        <ConfirmModal
          message={`Eliminare la cartella "${deletingFolder.name}" e tutti i suoi farmaci?`}
          onConfirm={handleDeleteFolder}
          onCancel={() => setDeletingFolder(null)}
        />
      )}
    </div>
  )
}
