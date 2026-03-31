import { useState, useRef } from 'react';
import { uid } from '../utils.js';

export function useDashboardData() {
  const [attachments, setAttachments] = useState({});
  const [records, setRecords] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [showAddRow, setShowAddRow] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRowEmail, setNewRowEmail] = useState('');
  const [activeMenu, setActiveMenu] = useState('Author');

  const fileInputRef = useRef();

  const mk = activeMenu.replace(/\s/g, '');
  const att = attachments[mk] || [];
  const rec = records[mk] || [];

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newAtt = files.map(f => ({ id: uid(), name: f.name, size: (f.size / 1024).toFixed(1) + ' KB', url: URL.createObjectURL(f) }));
    setAttachments(p => ({ ...p, [mk]: [...att, ...newAtt] }));
    e.target.value = '';
  };

  const removeAtt = (id) => setAttachments(p => ({ ...p, [mk]: att.filter(a => a.id !== id) }));

  const addRecord = () => {
    if (!newName.trim()) return;
    setRecords(p => ({ ...p, [mk]: [...rec, { id: uid(), name: newName.trim(), email: newRowEmail.trim() || '—' }] }));
    setNewName('');
    setNewRowEmail('');
    setShowAddRow(false);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditName(row.name);
    setEditEmail(row.email);
  };

  const saveEdit = (id) => {
    setRecords(p => ({ ...p, [mk]: rec.map(r => r.id === id ? { ...r, name: editName, email: editEmail } : r) }));
    setEditingId(null);
  };

  const deleteRow = (id) => setRecords(p => ({ ...p, [mk]: rec.filter(r => r.id !== id) }));

  return {
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
    mk,
    handleFiles,
    removeAtt,
    addRecord,
    startEdit,
    saveEdit,
    deleteRow,
  };
}
