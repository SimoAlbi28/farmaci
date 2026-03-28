import { useState, useCallback } from 'react'
import HomePage from './components/HomePage'
import FolderPage from './components/FolderPage'
import './App.css'

function App() {
  const [currentFolder, setCurrentFolder] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => setRefreshKey(k => k + 1), [])

  const openFolder = useCallback((folderId) => {
    setCurrentFolder(folderId)
  }, [])

  const goHome = useCallback(() => {
    setCurrentFolder(null)
    refresh()
  }, [refresh])

  return (
    <div className="app">
      {currentFolder === null ? (
        <HomePage key={refreshKey} onOpenFolder={openFolder} />
      ) : (
        <FolderPage folderId={currentFolder} onBack={goHome} />
      )}
    </div>
  )
}

export default App
