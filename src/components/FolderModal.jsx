import { useState } from 'react'

export default function FolderModal({ initialName = '', onSave, onClose }) {
  const [name, setName] = useState(initialName)
  const [error, setError] = useState('')

  const isEdit = initialName !== ''

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Il nome non può essere vuoto')
      return
    }
    const result = onSave(trimmed)
    if (result === false) {
      setError('Esiste già una cartella con questo nome')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? 'Rinomina Cartella' : 'Nuova Cartella'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="folder-name">Nome cartella</label>
            <input
              id="folder-name"
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              maxLength={50}
              autoFocus
              autoComplete="off"
            />
            {error && <p className="form-error">{error}</p>}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annulla
            </button>
            <button type="submit" className="btn btn-primary">
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
