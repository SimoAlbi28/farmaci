import { useState, useEffect } from 'react'
import { getFolders, createFolder, renameFolder, deleteFolder, getAlertsByFolder } from '../utils/storage'
import FolderModal from './FolderModal'
import ConfirmModal from './ConfirmModal'

export default function HomePage({ onOpenFolder, showAddFolder, onCloseAddFolder }) {
  const [folders, setFolders] = useState([])
  const [alerts, setAlerts] = useState({})
  const [editingFolder, setEditingFolder] = useState(null)
  const [deletingFolder, setDeletingFolder] = useState(null)
  const [openPopup, setOpenPopup] = useState(null)
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 })
  const [popupData, setPopupData] = useState(null)

  const reload = () => {
    setFolders(getFolders())
    setAlerts(getAlertsByFolder())
  }

  useEffect(() => {
    reload()
  }, [])

  const handleCreateFolder = (name) => {
    const folder = createFolder(name)
    if (!folder) return false
    reload()
    onCloseAddFolder()
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

  const togglePopup = (folderId, type, e) => {
    e.stopPropagation()
    if (openPopup === folderId + '|' + type) {
      setOpenPopup(null)
      setPopupData(null)
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    const popupWidth = 220
    let left = rect.left
    if (left + popupWidth > window.innerWidth - 16) {
      left = rect.right - popupWidth
    }
    if (left < 16) left = 16
    setPopupPos({ top: rect.bottom + 6, left })
    setPopupData({ folderId, type })
    setOpenPopup(folderId + '|' + type)
  }

  return (
    <div className="page" onClick={() => setOpenPopup(null)}>
      <div className="card-grid">
        {folders.map(folder => {
          const folderAlerts = alerts[folder.id]
          return (
            <div key={folder.id} className="folder-card">
              {folderAlerts && folderAlerts.warning.length > 0 && (
                <div className="folder-badge-left" onClick={e => e.stopPropagation()}>
                  <button
                    className="folder-warning folder-warning-yellow"
                    onClick={(e) => togglePopup(folder.id, 'warning', e)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="warning-icon">
                      <path d="M12 2L1 21h22L12 2z" fill="#ca8a04"/>
                      <text x="12" y="18" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">!</text>
                    </svg>
                    <span>{folderAlerts.warning.length}</span>
                  </button>
                </div>
              )}
              {folderAlerts && folderAlerts.expired.length > 0 && (
                <div className="folder-badge-right" onClick={e => e.stopPropagation()}>
                  <button
                    className="folder-warning folder-warning-red"
                    onClick={(e) => togglePopup(folder.id, 'expired', e)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="warning-icon">
                      <path d="M12 2L1 21h22L12 2z" fill="#c0392b"/>
                      <text x="12" y="18" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">!</text>
                    </svg>
                    <span>{folderAlerts.expired.length}</span>
                  </button>
                </div>
              )}
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
                  className="btn-icon-sm btn-icon-sm-danger"
                  onClick={() => setDeletingFolder(folder)}
                  title="Elimina"
                >
                  🗑️
                </button>
              </div>
            </div>
          )
        })}
        {folders.length === 0 && (
          <p className="empty-message">Nessuna cartella. Creane una!</p>
        )}
      </div>

      {openPopup && popupData && (() => {
        const folderAlerts = alerts[popupData.folderId]
        if (!folderAlerts) return null
        const items = popupData.type === 'expired' ? folderAlerts.expired : folderAlerts.warning
        const isExpired = popupData.type === 'expired'
        return (
          <div
            className="alert-popup"
            style={{ top: popupPos.top, left: popupPos.left }}
            onClick={e => e.stopPropagation()}
          >
            <div className={`alert-popup-title ${isExpired ? 'alert-popup-red' : 'alert-popup-yellow'}`}>
              {isExpired ? 'Scaduti' : 'In scadenza'}
            </div>
            {items.map((med, i) => (
              <div key={i} className="alert-popup-item">
                <span>{med.name}</span>
                <span className="alert-popup-date">{new Date(med.expiry).toLocaleDateString('it-IT')}</span>
              </div>
            ))}
          </div>
        )
      })()}

      {showAddFolder && (
        <FolderModal
          onSave={handleCreateFolder}
          onClose={onCloseAddFolder}
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
