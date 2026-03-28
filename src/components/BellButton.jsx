export default function BellButton({ count, seen, onClick }) {
  return (
    <button className="bell-btn" onClick={onClick} title="Notifiche">
      <svg className="bell-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C10.343 2 9 3.343 9 5V5.29C6.718 6.15 5 8.382 5 11V16L3 18V19H21V18L19 16V11C19 8.382 17.282 6.15 15 5.29V5C15 3.343 13.657 2 12 2Z" fill="currentColor"/>
        <path d="M12 23C13.657 23 15 21.657 15 20H9C9 21.657 10.343 23 12 23Z" fill="currentColor"/>
      </svg>
      {count > 0 && !seen && (
        <span className="bell-badge">{count > 9 ? '9+' : count}</span>
      )}
    </button>
  )
}
