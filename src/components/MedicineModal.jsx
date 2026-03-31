import { useState } from 'react'

export default function MedicineModal({ initialData = null, onSave, onClose }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    expiry: initialData?.expiry || '',
    dosage: initialData?.dosage || '',
    quantity: initialData?.quantity || '',
    notes: initialData?.notes || '',
  })

  const isEdit = initialData !== null

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({
      name: form.name.trim(),
      expiry: form.expiry,
      dosage: form.dosage.trim(),
      quantity: form.quantity.trim(),
      notes: form.notes.trim(),
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? 'Modifica Farmaco' : 'Nuovo Farmaco'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="med-name">Nome farmaco *</label>
            <input
              id="med-name"
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              maxLength={100}
              required
              autoFocus
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="med-expiry">Data di scadenza</label>
            <input
              id="med-expiry"
              type="date"
              value={form.expiry}
              onChange={e => update('expiry', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="med-dosage">Dosaggio</label>
            <input
              id="med-dosage"
              type="text"
              value={form.dosage}
              onChange={e => update('dosage', e.target.value)}
              maxLength={50}
              placeholder="es. 500mg"
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="med-quantity">Quantità</label>
            <input
              id="med-quantity"
              type="text"
              value={form.quantity}
              onChange={e => update('quantity', e.target.value)}
              maxLength={30}
              placeholder="es. 20 compresse"
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="med-notes">Note</label>
            <textarea
              id="med-notes"
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              maxLength={200}
              rows={2}
              placeholder="Note aggiuntive..."
            />
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
