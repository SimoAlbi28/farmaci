import { getExpiryStatus } from '../utils/storage'

export default function MedicineCard({ medicine, onEdit, onDelete }) {
  const status = getExpiryStatus(medicine.expiry)
  const expiryDate = new Date(medicine.expiry).toLocaleDateString('it-IT')

  const statusLabel = {
    ok: 'Valido',
    warning: 'In scadenza',
    expired: 'Scaduto',
  }

  return (
    <div className={`medicine-card status-${status}`}>
      <div className="medicine-header">
        <h3 className="medicine-name">{medicine.name}</h3>
        <div className="medicine-actions">
          <button className="btn-icon-sm" onClick={onEdit} title="Modifica">
            ✏️
          </button>
          <button className="btn-icon-sm" onClick={onDelete} title="Elimina">
            🗑️
          </button>
        </div>
      </div>

      <div className={`medicine-expiry expiry-${status}`}>
        <span className="expiry-label">Scadenza:</span>
        <span className="expiry-date">{expiryDate}</span>
        <span className={`expiry-badge badge-${status}`}>{statusLabel[status]}</span>
      </div>

      {(medicine.dosage || medicine.quantity || medicine.notes) && (
        <div className="medicine-details">
          {medicine.dosage && (
            <span className="detail-tag">💊 {medicine.dosage}</span>
          )}
          {medicine.quantity && (
            <span className="detail-tag">📦 {medicine.quantity}</span>
          )}
          {medicine.notes && (
            <p className="medicine-notes">{medicine.notes}</p>
          )}
        </div>
      )}
    </div>
  )
}
