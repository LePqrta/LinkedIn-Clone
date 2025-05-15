import { Link, useNavigate } from 'react-router-dom';
import { useAuthentication } from '../features/authentication/contexts/AuthenticationContextProvider';
import styles from './Navbar.module.scss';
import { useState } from 'react';

export function Navbar() {
  const navigate = useNavigate();
  const auth = useAuthentication();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  const isAdmin = auth?.user?.role === 'ADMIN';

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}><img src="/favicon.ico" alt="Logo" /></div>
      </div>
      <div className={styles.center}>
        <Link to="/" className={styles.navItem}>
          <span className={styles.icon}>🏠</span>
          <span className={styles.label}>Home</span>
        </Link>
        {isAdmin && (
          <Link to="/admin" className={styles.navItem}>
            <span className={styles.icon}>⚙️</span>
            <span className={styles.label}>Admin</span>
          </Link>
        )}
        <Link to="/connections" className={styles.navItem}>
          <span className={styles.icon}>👥</span>
          <span className={styles.label}>My Network</span>
        </Link>
        <Link to="/jobs" className={styles.navItem}>
          <span className={styles.icon}>💼</span>
          <span className={styles.label}>Jobs</span>
        </Link>
        <Link to="/notifications" className={styles.navItem}>
          <span className={styles.icon}>🔔</span>
          <span className={styles.label}>Notifications</span>
        </Link>
      </div>
      <div className={styles.right}>
        <div className={styles.profile} onClick={() => setProfileMenuOpen(v => !v)}>
          <span className={styles.icon}>👤</span>
          <span className={styles.label}>Me</span>
          <span className={styles.arrow}>▼</span>
          {profileMenuOpen && (
            <div className={styles.dropdown}>
              <Link to={`/profile/${auth?.user?.username || ''}`}>My Profile</Link>
              {isAdmin && <Link to="/admin">Admin Panel</Link>}
              <button onClick={handleLogout}>Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 