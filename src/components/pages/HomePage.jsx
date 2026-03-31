import { useState } from 'react';
import { S } from '../styles/authStyles';
import { GearIcon } from '../shared/GearIcon';
import { useDashboardData } from '../hooks/useDashboardData';
import { FONT_FAMILY, MENU_ITEMS, BACKGROUND_IMAGES } from '../constants';

export function HomePage({ onLogout, logo, onLogoClick }) {
  const {
    attachments,
    records,
    editingId, setEditingId,
    editName, setEditName,
    editEmail, setEditEmail,
    showAddRow, setShowAddRow,
    newName, setNewName,
    newRowEmail, setNewRowEmail,
    activeMenu, setActiveMenu,
    fileInputRef,
    att,
    rec,
    handleFiles,
    removeAtt,
    addRecord,
    startEdit,
    saveEdit,
    deleteRow,
  } = useDashboardData();

  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', fontFamily: FONT_FAMILY, backgroundColor: '#ffffff' }}>
      {/* Top bar */}
      <div style={S.homeTopBar}>
        <button
          type="button"
          onClick={onLogoClick}
          style={S.logoButton}
          aria-label="Go to home page"
        >
          <img src={logo} alt="TIP Logo" style={S.logoImg} />
          <div style={S.headerTextGroup}>
            <span style={{ ...S.headerTitle, color: '#1a1a1a' }}>Academic Research Unit</span>
            <span style={{ ...S.headerSubtitle, color: '#666' }}>Technological Institute of the Philippines</span>
          </div>
        </button>

        {/* Settings button + dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="settingsBtn"
            onClick={() => setShowDashboard(v => !v)}
            style={S.settingsBtn}
          >
            <GearIcon />
            <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: FONT_FAMILY }}>Settings</span>
          </button>

          {/* Dashboard dropdown panel */}
          {showDashboard && (
            <div className="overlay-panel" style={S.overlayPanel}>
              {/* Panel header */}
              <div style={S.panelHeader}>
                <span style={S.panelTitle}>⚙ Settings & Dashboard</span>
                <button onClick={() => setShowDashboard(false)} style={S.closeBtn}>✕</button>
              </div>

              <div style={{ display: 'flex', height: 'calc(100% - 52px)', overflow: 'hidden' }}>
                {/* Sidebar */}
                <aside style={S.panelSidebar}>
                  <div style={S.sideTitle}>● Settings</div>
                  {MENU_ITEMS.map(item => (
                    <button key={item} className="sideBtn"
                      onClick={() => { setActiveMenu(item); setEditingId(null); setShowAddRow(false); }}
                      style={{
                        ...S.sideBtn,
                        backgroundColor: item === activeMenu ? '#fdf3d8' : 'transparent',
                        color:            item === activeMenu ? '#b8860b' : '#2a2a2a',
                        border:           item === activeMenu ? '1px solid #d4a017' : '1px solid transparent',
                      }}>{item}</button>
                  ))}
                  <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #e8e2d4' }}>
                    <button onClick={onLogout} style={S.panelLogoutBtn}>Log out</button>
                  </div>
                </aside>

                {/* Main content */}
                <main style={S.panelMain}>
                  <div style={S.panelCardHeadingRow}>
                    <h2 style={S.cardHeading}>{activeMenu.toUpperCase()} INFORMATION</h2>
                    <button style={S.sysViewBtn}>System View</button>
                  </div>

                  {/* ATTACHMENTS */}
                  <div style={S.block}>
                    <div style={S.blockHeader}>
                      <span style={S.blockLabel}>Attachments</span>
                      <button style={S.uploadBtn} onClick={() => fileInputRef.current.click()}>+ Upload File</button>
                      <input ref={fileInputRef} type="file" multiple onChange={handleFiles} />
                    </div>
                    {att.length === 0 ? (
                      <div className="uploadArea" style={S.dropZone} onClick={() => fileInputRef.current.click()}>
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📂</div>
                        <p style={{ color: '#aaa', fontSize: '13px', fontFamily: FONT_FAMILY }}>Click to attach files, or drag &amp; drop here</p>
                      </div>
                    ) : (
                      <div style={S.fileList}>
                        {att.map(f => (
                          <div key={f.id} style={S.fileChip}>
                            <span style={{ fontSize: '14px' }}>📄</span>
                            <a href={f.url} download={f.name} style={S.fileLink}>{f.name}</a>
                            <span style={S.fileSize}>{f.size}</span>
                            <button className="actionBtn" style={S.removeBtn} onClick={() => removeAtt(f.id)}>✕</button>
                          </div>
                        ))}
                        <button style={{ ...S.uploadBtn, marginTop: '8px', display: 'inline-block' }}
                          onClick={() => fileInputRef.current.click()}>+ Add More</button>
                      </div>
                    )}
                  </div>

                  {/* RECORDS TABLE */}
                  <div style={S.block}>
                    <div style={{ ...S.blockHeader, marginBottom: '12px' }}>
                      <span style={S.blockLabel}>Records</span>
                      <button style={S.uploadBtn} onClick={() => setShowAddRow(v => !v)}>
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
                                    <button className="actionBtn" style={S.saveBtn}   onClick={() => saveEdit(row.id)}>✔ Save</button>
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
                </main>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
