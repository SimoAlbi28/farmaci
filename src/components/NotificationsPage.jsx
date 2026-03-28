import { useState, useEffect } from 'react'
import { getVisibleExpiredMedicines, dismissNotification, markNotificationsSeen } from '../utils/storage'

export default function NotificationsPage({ onOpenFolder }) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    setNotifications(getVisibleExpiredMedicines())
    markNotificationsSeen()
  }, [])

  const handleDismiss = (medId) => {
    dismissNotification(medId)
    setNotifications(prev => prev.filter(m => m.id !== medId))
  }

  return (
    <div className="page">
      {notifications.length > 0 ? (
        <div className="notifications">
          {notifications.map(med => (
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
                  onClick={() => handleDismiss(med.id)}
                  title="Elimina notifica"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">Nessuna notifica di scadenza.</p>
      )}
    </div>
  )
}
