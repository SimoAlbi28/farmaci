const STORAGE_KEY = 'farmaci_app_data'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { folders: [] }
    return JSON.parse(raw)
  } catch {
    return { folders: [] }
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getFolders() {
  return loadData().folders
}

export function getFolder(folderId) {
  return loadData().folders.find(f => f.id === folderId) || null
}

export function createFolder(name) {
  const data = loadData()
  const exists = data.folders.some(f => f.name.toLowerCase() === name.toLowerCase())
  if (exists) return null
  const folder = {
    id: crypto.randomUUID(),
    name,
    medicines: [],
  }
  data.folders.push(folder)
  saveData(data)
  return folder
}

export function renameFolder(folderId, newName) {
  const data = loadData()
  const duplicate = data.folders.some(
    f => f.id !== folderId && f.name.toLowerCase() === newName.toLowerCase()
  )
  if (duplicate) return false
  const folder = data.folders.find(f => f.id === folderId)
  if (!folder) return false
  folder.name = newName
  saveData(data)
  return true
}

export function deleteFolder(folderId) {
  const data = loadData()
  data.folders = data.folders.filter(f => f.id !== folderId)
  saveData(data)
}

export function addMedicine(folderId, medicine) {
  const data = loadData()
  const folder = data.folders.find(f => f.id === folderId)
  if (!folder) return null
  const med = {
    id: crypto.randomUUID(),
    name: medicine.name,
    expiry: medicine.expiry,
    dosage: medicine.dosage || '',
    quantity: medicine.quantity || '',
    notes: medicine.notes || '',
  }
  folder.medicines.push(med)
  saveData(data)
  return med
}

export function updateMedicine(folderId, medicineId, updates) {
  const data = loadData()
  const folder = data.folders.find(f => f.id === folderId)
  if (!folder) return false
  const med = folder.medicines.find(m => m.id === medicineId)
  if (!med) return false
  Object.assign(med, updates)
  saveData(data)
  return true
}

export function deleteMedicine(folderId, medicineId) {
  const data = loadData()
  const folder = data.folders.find(f => f.id === folderId)
  if (!folder) return
  folder.medicines = folder.medicines.filter(m => m.id !== medicineId)
  saveData(data)
}

export function getAlertsByFolder() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const alerts = {}
  for (const folder of loadData().folders) {
    const expired = []
    const warning = []
    for (const med of folder.medicines) {
      const expDate = new Date(med.expiry)
      expDate.setHours(0, 0, 0, 0)
      const diffDays = (expDate - today) / (1000 * 60 * 60 * 24)
      if (diffDays < 0) {
        expired.push({ name: med.name, expiry: med.expiry })
      } else if (diffDays <= 7) {
        warning.push({ name: med.name, expiry: med.expiry })
      }
    }
    if (expired.length > 0 || warning.length > 0) {
      alerts[folder.id] = { expired, warning }
    }
  }
  return alerts
}

export function getExpiredMedicines() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expired = []
  for (const folder of loadData().folders) {
    for (const med of folder.medicines) {
      const expDate = new Date(med.expiry)
      expDate.setHours(0, 0, 0, 0)
      if (expDate < today) {
        expired.push({ ...med, folderName: folder.name, folderId: folder.id })
      }
    }
  }
  return expired
}

const DISMISSED_KEY = 'farmaci_dismissed_notifications'

export function getDismissedIds() {
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]')
  } catch {
    return []
  }
}

export function dismissNotification(medId) {
  const ids = getDismissedIds()
  if (!ids.includes(medId)) {
    ids.push(medId)
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids))
  }
}

export function getVisibleExpiredMedicines() {
  const dismissed = getDismissedIds()
  return getExpiredMedicines().filter(m => !dismissed.includes(m.id))
}

const SEEN_KEY = 'farmaci_notif_seen'

export function getUnseenCount() {
  const visible = getVisibleExpiredMedicines()
  const seenAt = localStorage.getItem(SEEN_KEY)
  if (!seenAt) return visible.length
  return visible.filter(m => {
    const dismissed = getDismissedIds()
    return !dismissed.includes(m.id)
  }).length
}

export function markNotificationsSeen() {
  localStorage.setItem(SEEN_KEY, Date.now().toString())
}

export function getExpiryStatus(expiryDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expDate = new Date(expiryDate)
  expDate.setHours(0, 0, 0, 0)
  const diffDays = (expDate - today) / (1000 * 60 * 60 * 24)
  if (diffDays < 0) return 'expired'
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'tomorrow'
  if (diffDays <= 7) return 'warning'
  return 'ok'
}
