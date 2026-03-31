import { useState } from 'react';
import { S } from '../styles/authStyles';
import { Footer } from '../shared/Footer';
import { useDashboardData } from '../hooks/useDashboardData';
import { FONT_FAMILY, MENU_ITEMS } from '../constants';

export function HomePage({ onLogout, logo, onLogoClick, onOpenResearchPortal }) {
  const SETTINGS_FONT = "Georgia, 'Times New Roman', serif";

  const {
    editingId, setEditingId,
    editName, setEditName,
    editEmail, setEditEmail,
    showAddRow, setShowAddRow,
    newName, setNewName,
    newRowEmail, setNewRowEmail,
    activeMenu, setActiveMenu,
    rec,
    addRecord,
    startEdit,
    saveEdit,
    deleteRow,
  } = useDashboardData();

  const [activeTopTab, setActiveTopTab] = useState('repository');

  const topNavItems = [
    { key: 'repository', label: 'Repository' },
    { key: 'evaluation', label: 'Evaluation' },
    { key: 'database', label: 'Database' },
    { key: 'settings', label: 'Settings' },
  ];

  const handleTopNavClick = (tabKey) => {
    if (tabKey === 'evaluation') {
      onOpenResearchPortal?.('eval');
      return;
    }
    if (tabKey === 'database') {
      onOpenResearchPortal?.('db');
      return;
    }
    setActiveTopTab(tabKey);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', fontFamily: FONT_FAMILY, backgroundColor: '#f3f3f3' }}>
      {/* Top bar */}
      <div style={{ width: '100%', backgroundColor: '#151515', borderBottom: '1px solid #2f2f2f', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <button
          type="button"
          onClick={onLogoClick}
          style={S.logoButton}
          aria-label="Go to home page"
        >
          <img src={logo} alt="TIP Logo" style={S.logoImg} />
          <div style={S.headerTextGroup}>
            <span style={{ ...S.headerTitle, color: '#f0e8d0' }}>Academic Research Unit</span>
            <span style={{ ...S.headerSubtitle, color: '#9b9b9b' }}>Technological Institute of the Philippines</span>
          </div>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {topNavItems.map(item => {
            const isActive = item.key === activeTopTab;
            return (
              <button
                key={item.key}
                className="navBtn"
                onClick={() => handleTopNavClick(item.key)}
                style={{
                  border: 'none',
                  borderBottom: isActive ? '2px solid #d4a017' : '2px solid transparent',
                  background: 'transparent',
                  color: isActive ? '#d4a017' : '#f0e8d0',
                  fontFamily: FONT_FAMILY,
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '8px 14px',
                }}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={onLogout}
            style={{ marginLeft: '6px', padding: '8px 20px', background: 'transparent', color: '#f0e8d0', border: '1px solid #3e3e3e', borderRadius: '10px', fontFamily: FONT_FAMILY, fontSize: '17px', fontWeight: 700, cursor: 'pointer' }}
          >
            Log out
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {activeTopTab !== 'settings' ? (
          <div style={{ flex: 1, backgroundColor: '#f7f7f7' }} />
        ) : (
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            <aside style={{ width: '272px', minWidth: '272px', borderRight: '1px solid #e5dcc9', backgroundColor: '#fff' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1f1f1f', padding: '22px 16px 10px', fontFamily: SETTINGS_FONT, letterSpacing: '-0.2px', lineHeight: 1.05, whiteSpace: 'nowrap' }}>ScholarSphere</div>
              <div style={{ padding: '8px 14px 20px' }}>
                {MENU_ITEMS.map(item => (
                  <button
                    key={item}
                    className="sideBtn"
                    onClick={() => { setActiveMenu(item); setEditingId(null); setShowAddRow(false); }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      marginBottom: '5px',
                      padding: '10px 12px',
                      borderRadius: '9px',
                      cursor: 'pointer',
                      border: item === activeMenu ? '1px solid #d4a017' : '1px solid transparent',
                      backgroundColor: item === activeMenu ? '#fdf3d8' : 'transparent',
                      color: item === activeMenu ? '#b8860b' : '#2a2a2a',
                      fontSize: '16px',
                      fontWeight: 600,
                      fontFamily: SETTINGS_FONT,
                      letterSpacing: '0.1px',
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </aside>

            <main style={{ flex: 1, padding: '26px 24px 24px', backgroundColor: '#f7f7f7' }}>
              <h2 style={{ margin: '0 0 16px', color: '#d4a017', fontSize: '40px', lineHeight: 1, fontFamily: SETTINGS_FONT, fontWeight: 700, letterSpacing: '-0.3px', textAlign: 'left' }}>Settings</h2>
              <div style={{ border: '1px solid #ece7db', borderRadius: '16px', backgroundColor: '#fff', padding: '22px 24px' }}>
                <div style={{ ...S.block, marginBottom: 0 }}>
                  <div style={{ ...S.panelCardHeadingRow, marginBottom: '14px' }}>
                    <h2 style={{ ...S.cardHeading, fontSize: '34px', fontFamily: SETTINGS_FONT, letterSpacing: '-0.2px', lineHeight: 1.05 }}>{activeMenu.toUpperCase()}</h2>
                  </div>

                  <div style={{ ...S.blockHeader, marginBottom: '10px' }}>
                    <span style={{ ...S.blockLabel, fontSize: '30px', fontFamily: SETTINGS_FONT, fontWeight: 700, letterSpacing: '-0.2px', lineHeight: 1.05 }}>Records</span>
                    <button style={{ ...S.uploadBtn, fontSize: '18px', borderRadius: '10px', padding: '8px 14px', fontFamily: SETTINGS_FONT, fontWeight: 700, letterSpacing: '-0.1px' }} onClick={() => setShowAddRow(v => !v)}>
                      {showAddRow ? '✕ Cancel' : '+ Add Record'}
                    </button>
                  </div>

                  {showAddRow && (
                    <div style={S.addRowForm}>
                      <input style={{ ...S.inp, flex: 1 }} placeholder="Full name" value={newName} onChange={e => setNewName(e.target.value)} />
                      <input style={{ ...S.inp, flex: 2 }} type="email" placeholder="Email address" value={newRowEmail} onChange={e => setNewRowEmail(e.target.value)} />
                      <button style={S.saveBtn} onClick={addRecord}>✔ Save</button>
                    </div>
                  )}

                  <div style={S.tableWrap}>
                    <table style={S.table}>
                      <thead>
                        <tr style={S.thead}>
                          <th style={{ ...S.th, width: '50px' }}>ID</th>
                          <th style={S.th}>Name</th>
                          <th style={S.th}>Email</th>
                          <th style={{ ...S.th, width: '180px', textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rec.length === 0 ? (
                          <tr><td colSpan={4} style={S.emptyCell}>No records yet. Click "+ Add Record" to get started.</td></tr>
                        ) : rec.map((row, i) => (
                          <tr key={row.id} style={{ backgroundColor: i % 2 === 0 ? '#fafaf8' : '#fff' }}>
                            <td style={S.td}>{i + 1}</td>
                            <td style={S.td}>
                              {editingId === row.id
                                ? <input style={S.inlineInp} value={editName} onChange={e => setEditName(e.target.value)} />
                                : row.name}
                            </td>
                            <td style={S.td}>
                              {editingId === row.id
                                ? <input style={S.inlineInp} value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                                : row.email}
                            </td>
                            <td style={{ ...S.td, textAlign: 'center' }}>
                              {editingId === row.id ? (
                                <>
                                  <button className="actionBtn" style={S.saveBtn} onClick={() => saveEdit(row.id)}>✔ Save</button>
                                  <button className="actionBtn" style={S.cancelBtn} onClick={() => setEditingId(null)}>✕ Cancel</button>
                                </>
                              ) : (
                                <>
                                  <button className="actionBtn" style={S.renameBtn} onClick={() => startEdit(row)}>✏ Rename</button>
                                  <button className="actionBtn" style={S.deleteBtn} onClick={() => deleteRow(row.id)}>🗑 Delete</button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
