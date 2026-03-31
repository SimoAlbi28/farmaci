import { useState, useCallback, useEffect } from 'react'
import HomePage from './components/HomePage'
import FolderPage from './components/FolderPage'
import NotificationsPage from './components/NotificationsPage'
import BellButton from './components/BellButton'
import { getVisibleExpiredMedicines, markNotificationsSeen, getFolder } from './utils/storage'
import './App.css'

function App() {
  const [page, setPage] = useState('home')
  const [currentFolder, setCurrentFolder] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [notifCount, setNotifCount] = useState(0)
  const [notifSeen, setNotifSeen] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [showAddFolder, setShowAddFolder] = useState(false)

  const refreshNotifCount = useCallback(() => {
    const count = getVisibleExpiredMedicines().length
    setNotifCount(count)
  }, [])

  useEffect(() => {
    refreshNotifCount()
  }, [refreshNotifCount, refreshKey])

  const refresh = useCallback(() => setRefreshKey(k => k + 1), [])

  const openFolder = useCallback((folderId) => {
    const folder = getFolder(folderId)
    setFolderName(folder ? folder.name : '')
    setCurrentFolder(folderId)
    setPage('folder')
  }, [])

  const goHome = useCallback(() => {
    setCurrentFolder(null)
    setPage('home')
    refresh()
  }, [refresh])

  const openNotifications = useCallback(() => {
    setPage('notifications')
    setNotifSeen(true)
    markNotificationsSeen()
  }, [])

  const goBack = useCallback(() => {
    if (page === 'notifications') {
      if (currentFolder) {
        const folder = getFolder(currentFolder)
        setFolderName(folder ? folder.name : '')
        setPage('folder')
      } else {
        setPage('home')
      }
    } else {
      setCurrentFolder(null)
      setPage('home')
    }
    refresh()
  }, [page, currentFolder, refresh])

  const openFolderFromNotif = useCallback((folderId) => {
    const folder = getFolder(folderId)
    setFolderName(folder ? folder.name : '')
    setCurrentFolder(folderId)
    setPage('folder')
  }, [])

  const isHome = page === 'home'

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-left">
          {!isHome && (
            <button className="btn-back-nav" onClick={goBack} title="Indietro">
              ←
            </button>
          )}
          <img src="/icon-logo.png" alt="Logo Farmaci" className="navbar-logo" />
        </div>
        <h1 className="navbar-title">Farmaci</h1>
        <div className="navbar-actions">
          <BellButton count={notifCount} seen={notifSeen} onClick={openNotifications} />
        </div>
      </nav>

      {isHome && (
        <div className="home-add-container">
          <button className="home-add-btn" onClick={() => setShowAddFolder(true)} title="Nuova cartella">+ Crea cartella</button>
          <hr className="home-separator" />
          <h2 className="home-section-title">Cartelle</h2>
        </div>
      )}

      {page === 'home' && (
        <HomePage
          key={refreshKey}
          onOpenFolder={openFolder}
          showAddFolder={showAddFolder}
          onCloseAddFolder={() => setShowAddFolder(false)}
        />
      )}
      {page === 'folder' && currentFolder && (
        <FolderPage folderId={currentFolder} folderName={folderName} />
      )}
      {page === 'notifications' && (
        <NotificationsPage onOpenFolder={openFolderFromNotif} />
      )}
    </div>
  )
}

export default App
