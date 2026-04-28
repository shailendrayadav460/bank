import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import lmsService from '../../services/lmsService';
import { toast } from 'react-toastify';
import {
  Type, Image as ImageIcon, Video, Table, HelpCircle,
  Layout, List as ListIcon, Sigma, Plus, Edit2, Trash2,
  GripVertical, ChevronDown, ChevronRight, Bold, Italic, Underline,
  Eye, Save, Send, X, Smartphone, Monitor, Smartphone as PhoneIcon,
  Activity, Settings, Grid, Layers, AlignLeft, AlignCenter, AlignRight,
  Maximize, Minimize, Minus, MoreVertical, Tag, Check, Moon, Sun, Loader2, ArrowLeft,
  Copy, ArrowUp, ArrowDown
} from 'lucide-react';

const LearningModules = () => {
  const { theme: T } = useTheme();

  /* ─── State ─────────────────────────────────────────────── */
  const [activeUnit, setActiveUnit] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [openChapters, setOpenChapters] = useState([]);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('widgets'); // widgets | settings
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [previewTheme, setPreviewTheme] = useState('light'); // light | dark
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [initialBlocks, setInitialBlocks] = useState('[]'); // JSON string for easy comparison

  // Chapter Management
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [chapterForm, setChapterForm] = useState({ title: '', description: '', tag: '' });
  const [addingUnitToChapter, setAddingUnitToChapter] = useState(null);
  const [newUnitName, setNewUnitName] = useState('');

  const [chapters, setChapters] = useState([]);
  const [blocks, setBlocks] = useState([]);

  /* ─── Fetch Data ────────────────────────────────────────── */
  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const data = await lmsService.getChapters();
      setChapters(data);
      if (data.length > 0) {
        setOpenChapters([data[0].id]);
        if (data[0].units?.length > 0) {
          selectUnit(data[0].units[0].id, data[0].id);
        }
      }
    } catch (err) {
      toast.error('Failed to load chapters.');
    } finally {
      setLoading(false);
    }
  };

  const selectUnit = async (unitId, chapterId) => {
    try {
      setActiveUnit(unitId);
      setActiveChapter(chapterId);
      const unitData = await lmsService.getUnit(unitId);
      
      const mapped = (unitData.content_blocks || []).map(b => {
        const data = typeof b.content_data === 'string' ? JSON.parse(b.content_data) : b.content_data;
        
        let rows = data.rows || [['Col 1', 'Col 2'], ['Val 1', 'Val 2']];
        // If seeder has separate headers, prepend them
        if (data.headers && Array.isArray(data.headers)) {
          rows = [data.headers, ...rows];
        }

        return {
          id: b.id,
          type: b.type,
          content: data.text || data.caption || '',
          url: data.url || '',
          level: data.level || (b.type === 'header' ? 'h2' : 'p'),
          rows: rows,
          style: data.style || { fontSize: b.type === 'header' ? 20 : 14, fontWeight: b.type === 'header' ? '700' : 'normal', textAlign: 'left' }
        };
      });
      setBlocks(mapped);
      setInitialBlocks(JSON.stringify(mapped));
      setIsDirty(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load unit content.');
    }
  };

  /* ─── Handlers ─────────────────────────────────────────── */

  const addBlock = (type) => {
    const id = Date.now();
    let newBlock = { id, type, style: { color: T.text, fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none', textAlign: 'left', borderRadius: 12 } };

    if (type === 'header') newBlock = { ...newBlock, level: 'h2', content: 'New Header', style: { ...newBlock.style, fontSize: 20, fontWeight: '700' } };
    if (type === 'text') newBlock = { ...newBlock, content: 'Start writing here...' };
    if (type === 'table') newBlock = { ...newBlock, rows: [['Header 1', 'Header 2'], ['Cell 1', 'Cell 2']] };
    if (type === 'image') newBlock = { ...newBlock, content: 'New Image', url: 'https://images.unsplash.com/photo-1576091160550-217359946f3c', style: { ...newBlock.style, width: 100, textAlign: 'center' } };

    setBlocks([...blocks, newBlock]);
    setEditingBlockId(newBlock.id);
    setActiveTab('settings');
    setIsDirty(true);
  };

  const updateBlock = (id, updates) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
    setIsDirty(true);
  };

  const updateBlockStyle = (id, styleUpdates) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, style: { ...b.style, ...styleUpdates } } : b));
    setIsDirty(true);
  };

  const deleteBlock = (e, id) => {
    e.stopPropagation();
    setBlocks(blocks.filter(b => b.id !== id));
    setIsDirty(true);
    if (editingBlockId === id) {
      setEditingBlockId(null);
      setActiveTab('widgets');
    }
  };

  const updateTableCell = (blockId, rowIndex, colIndex, value) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        const newRows = [...b.rows];
        newRows[rowIndex][colIndex] = value;
        return { ...b, rows: newRows };
      }
      return b;
    }));
    setIsDirty(true);
  };

  const addTableRow = (blockId) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        const colCount = b.rows?.[0]?.length || 1;
        return { ...b, rows: [...b.rows, Array(colCount).fill('New Cell')] };
      }
      return b;
    }));
    setIsDirty(true);
  };

  const removeTableRow = (blockId) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.rows.length > 1) {
        return { ...b, rows: b.rows.slice(0, -1) };
      }
      return b;
    }));
    setIsDirty(true);
  };

  const addTableCol = (blockId) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        return { ...b, rows: b.rows.map(row => [...row, 'New Col']) };
      }
      return b;
    }));
    setIsDirty(true);
  };

  const removeTableCol = (blockId) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.rows[0].length > 1) {
        return { ...b, rows: b.rows.map(row => row.slice(0, -1)) };
      }
      return b;
    }));
    setIsDirty(true);
  };

  const copyBlock = (e, block) => {
    e.stopPropagation();
    const newBlock = { ...JSON.parse(JSON.stringify(block)), id: Date.now() };
    const index = blocks.findIndex(b => b.id === block.id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    toast.info('Block duplicated');
  };

  const moveBlock = (e, id, direction) => {
    e.stopPropagation();
    const index = blocks.findIndex(b => b.id === id);
    if ((direction === -1 && index === 0) || (direction === 1 && index === blocks.length - 1)) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(index + direction, 0, moved);
    setBlocks(newBlocks);
  };

  /* Chapter Logic */
  const openCreateChapter = () => {
    setEditingChapterId(null);
    setChapterForm({ title: '', description: '', tag: '' });
    setShowChapterModal(true);
  };

  const openEditChapter = (e, ch) => {
    e.stopPropagation();
    setEditingChapterId(ch.id);
    setChapterForm({ title: ch.title, description: ch.description || '', tag: ch.tag || '' });
    setShowChapterModal(true);
  };

  const handleDeleteChapter = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      try {
        await lmsService.deleteChapter(id);
        toast.success('Chapter deleted');
        fetchChapters();
      } catch (err) {
        toast.error('Failed to delete chapter');
      }
    }
  };

  const handleSaveChapter = async () => {
    if (!chapterForm.title) return toast.error('Please enter a title');

    try {
      if (editingChapterId) {
        await lmsService.updateChapter(editingChapterId, chapterForm);
        toast.success('Chapter updated');
      } else {
        await lmsService.saveChapter(chapterForm);
        toast.success('Chapter created');
      }
      setShowChapterModal(false);
      fetchChapters();
    } catch (err) {
      toast.error('Failed to save chapter');
    }
  };

  const handleAddUnit = async (chapterId) => {
    if (!newUnitName.trim()) return setAddingUnitToChapter(null);
    try {
      await lmsService.saveUnit(chapterId, { title: newUnitName });
      toast.success('Unit added');
      setNewUnitName('');
      setAddingUnitToChapter(null);
      fetchChapters();
    } catch (err) {
      toast.error('Failed to add unit');
    }
  };

  const onDragStart = (e, type) => {
    e.dataTransfer.setData('blockType', type);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('blockType');
    if (type) addBlock(type);
  };

  /* ─── Components ─────────────────────────────────────────── */

  const PhonePreview = ({ isFull = false }) => {
    const isDark = previewTheme === 'dark';
    const pBg = isDark ? '#0A111A' : '#ffffff';
    const pText = isDark ? '#111827' : '#111827';
    const pSubText = isDark ? '#94A3B8' : '#64748B';
    const pPrimary = '#1B6FDE';
    const pBorder = isDark ? '#1e293b' : '#E2E8F0';

    return (
      <div style={{
        width: isFull ? 260 : 200,
        height: isFull ? 520 : 420,
        backgroundColor: '#0F172A',
        borderRadius: 30,
        border: '4px solid #111827',
        boxShadow: isFull ? '0 30px 60px -15px rgba(0,0,0,0.5)' : '0 8px 20px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        fontFamily: "'Outfit', sans-serif",
        flexShrink: 0,
        margin: '0 auto',
        transform: !isFull ? 'scale(1)' : 'none' 
      }}>
        {/* Notch */}
        <div style={{ 
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', 
          width: 70, height: 20, backgroundColor: '#000', borderRadius: 10, zIndex: 110,
          border: '1px solid #333'
        }}></div>

        {/* Realistic Status Bar */}
        <div style={{ height: 36, padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F5F9', zIndex: 100, paddingTop: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: '#000' }}>9:41</span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <Activity size={10} color="#000" />
            <div style={{ width: 14, height: 7, border: '1px solid #000', borderRadius: 1.5, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0.5, left: 0.5, bottom: 0.5, width: 9, backgroundColor: '#000', borderRadius: 0.5 }}></div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, backgroundColor: '#F1F5F9', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="content-scroll">
          {/* Top Info */}
          <div style={{ padding: '16px 20px 8px 20px', backgroundColor: '#F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <ArrowLeft size={14} color={pPrimary} />
              <span style={{ fontSize: 11, fontWeight: 900, color: pPrimary }}>Back</span>
              <div style={{ backgroundColor: '#DBEAFE', padding: '4px 8px', borderRadius: 20, marginLeft: 'auto' }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: pPrimary, textTransform: 'uppercase' }}>
                  {chapters.find(c => c.id === activeChapter)?.title?.match(/(Chapter|Module)\s*\d+/i)?.[0] || 'Module I'}
                </span>
              </div>
            </div>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px 0', lineHeight: 1.2 }}>
              {chapters.find(c => c.id === activeChapter)?.title?.replace(/Chapter \d: /, '') || 'Preview'}
            </h1>
            <div style={{ display: 'inline-flex', padding: '4px 10px', backgroundColor: '#ffffff', borderRadius: 15, fontSize: 10, fontWeight: 700, color: '#6B7280', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              Core Learning Path
            </div>
          </div>

          <div style={{ padding: '4px 12px 16px 12px' }}>
            {(() => {
              const sections = [];
              let currentSection = null;

              blocks.forEach(block => {
                if (block.type === 'header') {
                  if (currentSection) sections.push(currentSection);
                  currentSection = { header: block, items: [] };
                } else {
                  if (!currentSection) currentSection = { header: null, items: [] };
                  currentSection.items.push(block);
                }
              });
              if (currentSection) sections.push(currentSection);

              return sections.map((sec, sIdx) => (
                <div key={sIdx} style={{ 
                  backgroundColor: '#ffffff',
                  borderRadius: 20,
                  marginBottom: 12,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  border: '1px solid #E5E7EB'
                }}>
                  {sec.header && (
                    <div style={{ padding: '14px 18px 10px 18px', borderBottom: '1px solid #F3F4F6', backgroundColor: '#ffffff' }}>
                      <div style={{
                        fontSize: 10, 
                        fontWeight: 700, 
                        color: pPrimary, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.4px'
                      }}>{sec.header.content}</div>
                    </div>
                  )}
                  
                  <div style={{ padding: '16px 18px' }}>
                    {sec.items.map((item, iIdx) => (
                      <div key={iIdx} style={{ marginBottom: iIdx === sec.items.length - 1 ? 0 : 16 }}>
                        {item.type === 'text' && (
                          <div style={{
                            fontSize: 12,
                            fontWeight: 500,
                            lineHeight: 1.55,
                            color: '#444',
                            margin: 0,
                            whiteSpace: 'pre-wrap'
                          }}>
                            {item.content.split(' ').map((word, wi) => {
                              const cleanWord = word.replace(/[.,()]/g, '');
                              const pTerms = ['Lead', 'WCT', 'Posterior', 'ECG', 'P-R', 'QRS', 'ST', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9'];
                              const isKeyword = pTerms.some(k => cleanWord === k || cleanWord.startsWith(k + '-') || (cleanWord.length > 2 && k.includes(cleanWord)));
                              return <span key={wi} style={{ color: isKeyword ? pPrimary : 'inherit', fontWeight: isKeyword ? 800 : 'inherit' }}>{word} </span>
                            })}
                          </div>
                        )}
                        {item.type === 'code' && (
                          <div style={{ 
                            backgroundColor: '#0A1521', 
                            padding: '16px', 
                            borderRadius: 14, 
                            fontFamily: "'JetBrains Mono', monospace",
                            boxShadow: 'inset 0 1px 5px rgba(0,0,0,0.2)',
                            margin: '4px 0'
                          }}>
                             {(item.content || item.code || '').split('\n').map((line, li) => (
                               <div key={li} style={{ color: '#2DD4BF', fontSize: 10, lineHeight: 1.8, fontWeight: 600 }}>
                                  {line.includes('=') ? line.split('=').map((part, pi) => (
                                    <span key={pi} style={{ color: pi === 0 ? '#2DD4BF' : '#fff' }}>
                                      {part}{pi === 0 ? ' = ' : ''}
                                    </span>
                                  )) : line}
                               </div>
                             ))}
                          </div>
                        )}
                        {item.type === 'image' && (
                          <div style={{ borderRadius: 12, overflow: 'hidden', backgroundColor: '#000', border: '1px solid #eee', margin: '6px 0' }}>
                            <img src={item.url} style={{ width: '100%', display: 'block' }} alt="" />
                          </div>
                        )}
                        {item.type === 'table' && (
                          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', margin: '0 -4px', paddingBottom: '4px' }}>
                            <table style={{ minWidth: item.rows?.[0]?.length > 2 ? `${Math.max(450, item.rows[0].length * 110)}px` : '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
                              <thead>
                                <tr>
                                  {item.rows?.[0]?.map((h, i) => (
                                    <th key={i} style={{ padding: '10px 8px', textAlign: 'left', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', borderBottom: '1px solid #F3F4F6', whiteSpace: 'nowrap' }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {item.rows?.slice(1).map((row, rIdx) => (
                                  <tr key={rIdx} style={{ borderBottom: rIdx === item.rows.length - 2 ? 'none' : '1px solid #F9FAFB' }}>
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} style={{ padding: '12px 8px', color: '#374151', fontWeight: 500, fontSize: 12, lineHeight: 1.6 }}>{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
            </div>
          </div>
          
          {/* Bottom Nav Mock */}
          <div style={{ 
            height: 56, backgroundColor: pBg, borderTop: `1px solid ${pBorder}`, 
            display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10
          }}>
            {[
              { icon: Layout, label: 'Home' },
              { icon: Layers, label: 'Learn', active: true },
              { icon: Activity, label: 'Train' },
              { icon: HelpCircle, label: 'Cases' },
              { icon: Settings, label: 'Settings' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, opacity: item.active ? 1 : 0.35 }}>
                <item.icon size={18} color={item.active ? pPrimary : pSubText} />
                <span style={{ fontSize: 8, fontWeight: 800, color: item.active ? pPrimary : pSubText }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    };

  const blockBeingEdited = blocks.find(b => b.id === editingBlockId);

  /* ── Styles ── */
  const toolbarBtn = (active, extra = {}) => ({
    padding: '8px',
    borderRadius: 8,
    border: 'none',
    background: active ? T.primaryBg : 'transparent',
    color: active ? T.primary : T.textSub,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    ...extra
  });

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', margin: '-32px', width: 'calc(100% + 64px)', backgroundColor: T.bg,
    }}>
      {/* ── Slim Header ── */}
      <header style={{
        height: 52, padding: '0 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: T.card, zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: T.textSub }}>
              {chapters.find(c => c.id === activeChapter)?.title || 'No Chapter'} &gt; {chapters.find(c => c.id === activeChapter)?.units?.find(u => u.id === activeUnit)?.title || 'No Unit'}
            </div>
            <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Learning Elementor</h2>
          </div>
          <button onClick={() => setShowFullPreview(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', backgroundColor: T.primaryBg, border: `1px solid ${T.primary}20`, borderRadius: 6, color: T.primary, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Eye size={14} /> Preview App
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: T.success, fontWeight: 600 }}>
             <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: T.success }}></div>
             Active Project
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={{ color: T.danger, background: 'none', border: 'none', fontWeight: 600, fontSize: 11, cursor: 'pointer' }}>Discard</button>
          <div style={{ width: 1, height: 20, backgroundColor: T.border }}></div>
          <button 
            onClick={() => {/* Draft logic if needed */}}
            style={{ padding: '6px 14px', backgroundColor: 'transparent', color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
          >Draft</button>
          <button 
            disabled={!isDirty || isPublishing}
            onClick={async () => {
              if (!activeUnit) return toast.error('No unit selected');
              try {
                setIsPublishing(true);
                // Map local elementor blocks back to backend format
                const toSave = blocks.map((b, idx) => ({
                  type: b.type,
                  order_index: idx + 1,
                  content_data: {
                    text: b.content,
                    url: b.url,
                    level: b.level,
                    rows: b.rows,
                    style: b.style
                  }
                }));
                await lmsService.saveUnitContent(activeUnit, toSave);
                setInitialBlocks(JSON.stringify(blocks));
                setIsDirty(false);
                toast.success('Content published successfully!');
              } catch (err) {
                toast.error('Failed to publish content');
              } finally {
                setIsPublishing(false);
              }
            }}
            style={{ 
              padding: '6px 20px', 
              backgroundColor: !isDirty || isPublishing ? T.border : T.primary, 
              color: '#fff', 
              border: 'none', 
              borderRadius: 6, 
              fontWeight: 700, 
              fontSize: 12, 
              cursor: !isDirty || isPublishing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            {isPublishing ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              'Publish'
            )}
          </button>
        </div>
      </header>

      {/* ── Main Canvas ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr 360px', overflow: 'hidden' }}>

        {/* Left: Navigation */}
        <aside style={{ borderRight: `1px solid ${T.border}`, padding: '12px 10px', backgroundColor: T.sidebar, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>
                <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto', color: T.primary }} />
                <div style={{ fontSize: 11, marginTop: 12, fontWeight: 700 }}>Loading Modules...</div>
              </div>
            ) : chapters.map(ch => {
              const isOpen = openChapters.includes(ch.id);
              return (
                <div key={ch.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div
                    onClick={() => setOpenChapters(prev => prev.includes(ch.id) ? prev.filter(id => id !== ch.id) : [...prev, ch.id])}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px',
                      cursor: 'pointer', color: T.text, fontSize: 13, fontWeight: 700,
                      backgroundColor: isOpen ? T.primaryBg : 'transparent', borderRadius: 8,
                      position: 'relative', transition: 'all 0.2s', border: `1px solid ${isOpen ? T.primary : 'transparent'}`
                    }}
                  >
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {isOpen ? <ChevronDown size={14} color={T.primary} /> : <ChevronRight size={14} />}
                      <span>{ch.title}</span>
                    </div>

                    <div className="chapter-actions" style={{ display: 'flex', gap: 6 }}>
                      <button onClick={(e) => openEditChapter(e, ch)} style={{ background: 'none', border: 'none', color: T.textSub, cursor: 'pointer', padding: 4 }}><Edit2 size={12} /></button>
                      <button onClick={(e) => handleDeleteChapter(e, ch.id)} style={{ background: 'none', border: 'none', color: T.danger, cursor: 'pointer', padding: 4 }}><Trash2 size={12} /></button>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 12, gap: 2, position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 16, top: 0, bottom: 0, width: 1, backgroundColor: T.border }}></div>
                      {ch.units?.map((u, idx) => (
                        <button
                          key={u.id}
                          onClick={() => selectUnit(u.id, ch.id)}
                          style={{
                            padding: '8px 12px 8px 18px', border: 'none', background: activeUnit === u.id ? T.activeNav : 'transparent',
                            textAlign: 'left', color: activeUnit === u.id ? T.primary : T.text, borderRadius: 6,
                            fontSize: 12, fontWeight: activeUnit === u.id ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                            position: 'relative', opacity: activeUnit === u.id ? 1 : 0.7
                          }}
                        >
                          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: activeUnit === u.id ? T.primary : T.border, zIndex: 2 }} />
                          {u.title}
                        </button>
                      ))}

                      {addingUnitToChapter === ch.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px 4px 18px' }}>
                          <input
                            autoFocus
                            value={newUnitName}
                            onChange={(e) => setNewUnitName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddUnit(ch.id)}
                            placeholder="Unit Name"
                            style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: `1px solid ${T.primary}`, backgroundColor: T.bg, color: T.text, fontSize: 12, outline: 'none' }}
                          />
                          <button onClick={() => handleAddUnit(ch.id)} style={{ padding: 4, background: 'none', border: 'none', color: T.success || '#10b981', cursor: 'pointer' }}><Check size={16} /></button>
                          <button onClick={() => setAddingUnitToChapter(null)} style={{ padding: 4, background: 'none', border: 'none', color: T.danger, cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); setAddingUnitToChapter(ch.id); }}
                          style={{ padding: '8px 12px 8px 18px', background: 'none', border: 'none', color: T.primary, fontSize: 11, fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
                        >
                          + Add Unit
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={openCreateChapter}
            style={{
              marginTop: 'auto', padding: '12px', backgroundColor: T.primaryBg, color: T.primary,
              border: `1px solid ${T.primary}30`, borderRadius: 10, fontWeight: 700, fontSize: 13,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = T.primary; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = T.primaryBg; e.currentTarget.style.color = T.primary; }}
          >
            <Plus size={18} /> Add Chapter
          </button>
        </aside>

        {/* Center: Editor Canvas */}
        <main
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          style={{ padding: '32px 48px', overflowY: 'auto', backgroundColor: T.bg, display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: T.text }}>Editor Canvas</h3>
            <span style={{ fontSize: 11, color: T.textSub, fontWeight: 600 }}>Active Unit Content</span>
          </div>

          {blocks.map(block => {
            const isActive = editingBlockId === block.id;
            const s = block.style || {};
            return (
              <div
                key={block.id}
                onClick={() => { setEditingBlockId(block.id); setActiveTab('settings'); }}
                style={{
                  padding: 20, backgroundColor: T.card, borderRadius: 12, border: `2px solid ${isActive ? T.primary : T.border}`,
                  position: 'relative', display: 'flex', gap: 16, cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: isActive ? '0 10px 20px -10px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: T.border, cursor: 'grab' }}>
                  <GripVertical size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: T.primary, textTransform: 'uppercase' }}>{block.type}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={(e) => moveBlock(e, block.id, -1)} style={{ background: 'none', border: 'none', color: T.textSub, cursor: 'pointer', padding: 2 }} title="Move Up"><ArrowUp size={14} /></button>
                        <button onClick={(e) => moveBlock(e, block.id, 1)} style={{ background: 'none', border: 'none', color: T.textSub, cursor: 'pointer', padding: 2 }} title="Move Down"><ArrowDown size={14} /></button>
                        <button onClick={(e) => copyBlock(e, block)} style={{ background: 'none', border: 'none', color: T.textSub, cursor: 'pointer', padding: 2 }} title="Duplicate"><Copy size={14} /></button>
                        <button onClick={(e) => deleteBlock(e, block.id)} style={{ background: 'none', border: 'none', color: T.danger, cursor: 'pointer', padding: 2 }} title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </div>

                  {block.type === 'header' && (
                    <input
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'none',
                        outline: 'none',
                        padding: 0,
                        fontSize: s.fontSize || 24,
                        fontWeight: s.fontWeight || '800',
                        fontStyle: s.fontStyle || 'normal',
                        textDecoration: s.textDecoration || 'none',
                        textAlign: s.textAlign || 'left',
                        color: s.color || T.text
                      }}
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      placeholder="Header text..."
                    />
                  )}

                  {block.type === 'text' && (
                    <textarea
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'none',
                        outline: 'none',
                        padding: 0,
                        resize: 'none',
                        fontSize: s.fontSize || 14,
                        fontWeight: s.fontWeight || 'normal',
                        fontStyle: s.fontStyle || 'normal',
                        textDecoration: s.textDecoration || 'none',
                        textAlign: s.textAlign || 'left',
                        color: s.color || T.text,
                        lineHeight: 1.6
                      }}
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                      placeholder="Start writing here..."
                    />
                  )}

                  {block.type === 'image' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: block.style?.textAlign === 'center' ? 'center' : (block.style?.textAlign === 'right' ? 'flex-end' : 'flex-start') }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text, width: '100%' }}>{block.content}</div>
                      <div style={{
                        width: `${block.style?.width || 100}%`,
                        height: 200,
                        backgroundColor: T.sidebar,
                        borderRadius: s.borderRadius || 12,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${T.border}`
                      }}>
                        <img src={block.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="prev" />
                      </div>
                    </div>
                  )}

                  {block.type === 'table' && (
                    <div style={{
                      borderRadius: s.borderRadius || 8, overflow: 'hidden', border: `1px solid ${T.border}`, marginTop: 8,
                      backgroundColor: T.bg
                    }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <tbody>
                          {block.rows?.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} style={{ border: `1px solid ${T.border}`, padding: '10px 12px', background: rIdx === 0 ? T.sidebar : 'transparent' }}>
                                  <input
                                    value={cell}
                                    onChange={(e) => updateTableCell(block.id, rIdx, cIdx, e.target.value)}
                                    style={{ width: '100%', border: 'none', background: 'transparent', color: T.text, fontSize: 13, fontWeight: rIdx === 0 ? 700 : 400, outline: 'none' }}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </main>

        {/* Right: Tools */}
        <aside style={{ borderLeft: `1px solid ${T.border}`, backgroundColor: T.card, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}` }}>
            <button onClick={() => setActiveTab('widgets')} style={{ flex: 1, padding: '16px', border: 'none', background: activeTab === 'widgets' ? T.bg : 'transparent', borderBottom: activeTab === 'widgets' ? `4px solid ${T.primary}` : 'none', color: activeTab === 'widgets' ? T.primary : T.textSub, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Grid size={14} /> WIDGETS
            </button>
            <button onClick={() => setActiveTab('settings')} style={{ flex: 1, padding: '16px', border: 'none', background: activeTab === 'settings' ? T.bg : 'transparent', borderBottom: activeTab === 'settings' ? `4px solid ${T.primary}` : 'none', color: activeTab === 'settings' ? T.primary : T.textSub, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Settings size={14} /> SETTINGS
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {activeTab === 'widgets' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { icon: <Type size={18} />, label: 'Header', type: 'header' },
                  { icon: <ListIcon size={18} />, label: 'Text Block', type: 'text' },
                  { icon: <ImageIcon size={18} />, label: 'Image', type: 'image' },
                  { icon: <Video size={18} />, label: 'Video', type: 'video' },
                  { icon: <Table size={18} />, label: 'Table', type: 'table' },
                  { icon: <HelpCircle size={18} />, label: 'Quiz', type: 'quiz' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    draggable
                    onDragStart={(e) => onDragStart(e, item.type)}
                    onClick={() => addBlock(item.type)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 12px',
                      backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 16, color: T.text, fontSize: 11, fontWeight: 700, cursor: 'grab',
                      transition: 'all 0.2s ease'
                    }}
                    className="widget-hover"
                  >
                    <div style={{ padding: 10, borderRadius: 10, backgroundColor: T.primaryBg, color: T.primary }}>{item.icon}</div>
                    {item.label}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {blockBeingEdited ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: T.primary, textTransform: 'uppercase' }}>Configuring: {blockBeingEdited.type}</div>

                    {/* Content Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: T.textSub, textTransform: 'uppercase' }}>Content</label>
                      {blockBeingEdited.type === 'text' ? (
                        <textarea
                          rows={4}
                          value={blockBeingEdited.content}
                          onChange={(e) => updateBlock(blockBeingEdited.id, { content: e.target.value })}
                          style={{ width: '100%', padding: 12, borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 13, resize: 'none', outline: 'none' }}
                        />
                      ) : blockBeingEdited.type === 'table' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <div style={{ display: 'flex', backgroundColor: T.sidebar, borderRadius: 8, padding: 4, gap: 4 }}>
                              <button onClick={() => addTableRow(blockBeingEdited.id)} style={{ flex: 1, padding: '8px', fontSize: 11, borderRadius: 6, border: 'none', background: T.bg, color: T.text, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Plus size={12} /> Row</button>
                              <button onClick={() => removeTableRow(blockBeingEdited.id)} style={{ flex: 1, padding: '8px', fontSize: 11, borderRadius: 6, border: 'none', background: T.bg, color: T.danger, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Minus size={12} /> Row</button>
                            </div>
                            <div style={{ display: 'flex', backgroundColor: T.sidebar, borderRadius: 8, padding: 4, gap: 4 }}>
                              <button onClick={() => addTableCol(blockBeingEdited.id)} style={{ flex: 1, padding: '8px', fontSize: 11, borderRadius: 6, border: 'none', background: T.bg, color: T.text, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Plus size={12} /> Col</button>
                              <button onClick={() => removeTableCol(blockBeingEdited.id)} style={{ flex: 1, padding: '8px', fontSize: 11, borderRadius: 6, border: 'none', background: T.bg, color: T.danger, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Minus size={12} /> Col</button>
                            </div>
                          </div>
                          <div style={{ overflowX: 'auto', border: `1px solid ${T.border}`, borderRadius: 10, backgroundColor: T.bg }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <tbody>
                                {blockBeingEdited.rows?.map((row, rIdx) => (
                                  <tr key={rIdx}>
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} style={{ border: `1px solid ${T.border}`, padding: 0 }}>
                                        <input
                                          value={cell}
                                          onChange={(e) => updateTableCell(blockBeingEdited.id, rIdx, cIdx, e.target.value)}
                                          style={{ width: '100%', padding: 8, border: 'none', background: 'transparent', color: T.text, fontSize: 12, outline: 'none' }}
                                        />
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={blockBeingEdited.content}
                          onChange={(e) => updateBlock(blockBeingEdited.id, { content: e.target.value })}
                          style={{ width: '100%', padding: 12, borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 13, outline: 'none' }}
                        />
                      )}
                    </div>

                    {blockBeingEdited.type === 'image' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: T.textSub, textTransform: 'uppercase' }}>Media Source</label>

                        {/* Tabs for Upload vs URL */}
                        <div style={{ display: 'flex', gap: 8, padding: 4, backgroundColor: T.sidebar, borderRadius: 10 }}>
                          <button
                            onClick={() => updateBlock(blockBeingEdited.id, { _sourceTab: 'upload' })}
                            style={toolbarBtn(blockBeingEdited._sourceTab !== 'url', { flex: 1, fontSize: 11, fontWeight: 700 })}
                          >Upload File</button>
                          <button
                            onClick={() => updateBlock(blockBeingEdited.id, { _sourceTab: 'url' })}
                            style={toolbarBtn(blockBeingEdited._sourceTab === 'url', { flex: 1, fontSize: 11, fontWeight: 700 })}
                          >Paste URL</button>
                        </div>

                        {blockBeingEdited._sourceTab === 'url' ? (
                          <input
                            type="text"
                            placeholder="https://example.com/image.png"
                            value={blockBeingEdited.url}
                            onChange={(e) => updateBlock(blockBeingEdited.id, { url: e.target.value })}
                            style={{ width: '100%', padding: 12, borderRadius: 8, border: `1px solid ${T.border}`, backgroundColor: T.bg, color: T.text, fontSize: 13, outline: 'none' }}
                          />
                        ) : (
                          <div
                            onClick={() => document.getElementById('image-upload-input').click()}
                            style={{
                              border: `2px dashed ${T.border}`, borderRadius: 12, padding: 20, textAlign: 'center', cursor: 'pointer',
                              backgroundColor: T.bg, transition: 'all 0.2s'
                            }}
                          >
                            <ImageIcon size={24} style={{ color: T.textSub, marginBottom: 8 }} />
                            <div style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>Click to browse</div>
                            <div style={{ fontSize: 10, color: T.textSub }}>PNG, JPG or SVG (max 2MB)</div>
                            <input
                              id="image-upload-input"
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => updateBlock(blockBeingEdited.id, { url: reader.result });
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Typography Toolbar */}
                    {(blockBeingEdited.type === 'text' || blockBeingEdited.type === 'header') && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: T.textSub, textTransform: 'uppercase' }}>Typography</label>

                        <div style={{ display: 'flex', gap: 4, backgroundColor: T.sidebar, padding: 4, borderRadius: 10 }}>
                          <button
                            style={toolbarBtn(blockBeingEdited.style?.fontWeight === 'bold')}
                            onClick={() => updateBlockStyle(blockBeingEdited.id, { fontWeight: blockBeingEdited.style?.fontWeight === 'bold' ? 'normal' : 'bold' })}
                          ><Bold size={16} /></button>
                          <button
                            style={toolbarBtn(blockBeingEdited.style?.fontStyle === 'italic')}
                            onClick={() => updateBlockStyle(blockBeingEdited.id, { fontStyle: blockBeingEdited.style?.fontStyle === 'italic' ? 'normal' : 'italic' })}
                          ><Italic size={16} /></button>
                          <button
                            style={toolbarBtn(blockBeingEdited.style?.textDecoration === 'underline')}
                            onClick={() => updateBlockStyle(blockBeingEdited.id, { textDecoration: blockBeingEdited.style?.textDecoration === 'underline' ? 'none' : 'underline' })}
                          ><Underline size={16} /></button>
                          <div style={{ width: 1, height: 20, backgroundColor: T.border, margin: '0 4px' }} />
                          <button
                            style={toolbarBtn(blockBeingEdited.style?.textAlign === 'left')}
                            onClick={() => updateBlockStyle(blockBeingEdited.id, { textAlign: 'left' })}
                          ><AlignLeft size={16} /></button>
                          <button
                            style={toolbarBtn(blockBeingEdited.style?.textAlign === 'center')}
                            onClick={() => updateBlockStyle(blockBeingEdited.id, { textAlign: 'center' })}
                          ><AlignCenter size={16} /></button>
                          <button
                            style={toolbarBtn(blockBeingEdited.style?.textAlign === 'right')}
                            onClick={() => updateBlockStyle(blockBeingEdited.id, { textAlign: 'right' })}
                          ><AlignRight size={16} /></button>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: T.textSub }}>FONT SIZE</label>
                            <span style={{ fontSize: 11, fontWeight: 800, color: T.primary }}>{blockBeingEdited.style?.fontSize}px</span>
                          </div>
                          <input
                            type="range" min="10" max="60"
                            value={blockBeingEdited.style?.fontSize}
                            onChange={(e) => updateBlockStyle(blockBeingEdited.id, { fontSize: parseInt(e.target.value) })}
                            style={{ width: '100%', height: 4, borderRadius: 2, appearance: 'none', background: T.border, cursor: 'pointer' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Image/Table Styling */}
                    {blockBeingEdited.type === 'image' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: T.textSub }}>IMAGE WIDTH (%)</label>
                          <input
                            type="number"
                            value={blockBeingEdited.style?.width || 100}
                            onChange={(e) => updateBlockStyle(blockBeingEdited.id, { width: parseInt(e.target.value) || 0 })}
                            style={{ width: 45, border: 'none', background: T.sidebar, color: T.primary, fontSize: 11, fontWeight: 800, textAlign: 'right', outline: 'none' }}
                          />
                        </div>
                        <input
                          type="range" min="10" max="100"
                          value={blockBeingEdited.style?.width || 100}
                          onChange={(e) => updateBlockStyle(blockBeingEdited.id, { width: parseInt(e.target.value) })}
                          style={{ width: '100%', height: 4, borderRadius: 2, appearance: 'none', background: T.border, cursor: 'pointer' }}
                        />

                        <label style={{ fontSize: 11, fontWeight: 700, color: T.textSub, marginTop: 8 }}>ALIGNMENT</label>
                        <div style={{ display: 'flex', gap: 4, backgroundColor: T.sidebar, padding: 4, borderRadius: 10 }}>
                          <button
                            style={toolbarBtn(blockBeingEdited.style?.textAlign === 'left')}
                            onClick={() => updateBlockStyle(blockBeingEdited.id, { textAlign: 'left' })}
                          ><AlignLeft size={16} /></button>
                          <button
                            style={toolbarBtn(blockBeingEdited.style?.textAlign === 'center' || !blockBeingEdited.style?.textAlign)}
                            onClick={() => updateBlockStyle(blockBeingEdited.id, { textAlign: 'center' })}
                          ><AlignCenter size={16} /></button>
                          <button
                            style={toolbarBtn(blockBeingEdited.style?.textAlign === 'right')}
                            onClick={() => updateBlockStyle(blockBeingEdited.id, { textAlign: 'right' })}
                          ><AlignRight size={16} /></button>
                        </div>
                      </div>
                    )}

                    {(blockBeingEdited.type === 'image' || blockBeingEdited.type === 'table') && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: T.textSub }}>BORDER RADIUS</label>
                          <span style={{ fontSize: 11, fontWeight: 800, color: T.primary }}>{blockBeingEdited.style?.borderRadius || 0}px</span>
                        </div>
                        <input
                          type="range" min="0" max="50"
                          value={blockBeingEdited.style?.borderRadius || 0}
                          onChange={(e) => updateBlockStyle(blockBeingEdited.id, { borderRadius: parseInt(e.target.value) })}
                          style={{ width: '100%', height: 4, borderRadius: 2, appearance: 'none', background: T.border, cursor: 'pointer' }}
                        />
                      </div>
                    )}

                    {/* Color Section */}
                    {blockBeingEdited.type !== 'image' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: T.textSub, textTransform: 'uppercase' }}>Text Color</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, backgroundColor: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
                          <input
                            type="color"
                            value={blockBeingEdited.style?.color || (T.name === 'dark' ? '#ffffff' : '#000000')}
                            onChange={(e) => updateBlockStyle(blockBeingEdited.id, { color: e.target.value })}
                            style={{ width: 32, height: 32, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                          />
                          <code style={{ fontSize: 12, color: T.text }}>{blockBeingEdited.style?.color || (T.name === 'dark' ? '#ffffff' : '#000000')}</code>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {[T.text, '#1B6FDE', '#00D4FF', '#10b981', '#f59e0b', '#ef4444', '#64748b'].map(c => (
                            <div
                              key={c}
                              onClick={() => updateBlockStyle(blockBeingEdited.id, { color: c })}
                              style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: c, cursor: 'pointer', border: blockBeingEdited.style?.color === c ? `3px solid ${T.primary}` : `2px solid ${T.border}`, transition: 'all 0.2s' }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Spacing & Alignment */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: T.textSub, textTransform: 'uppercase' }}>Alignment</label>
                      <div style={{ display: 'flex', backgroundColor: T.bg, padding: 4, borderRadius: 10, border: `1px solid ${T.border}` }}>
                        {['left', 'center', 'right', 'justify'].map(align => (
                          <button
                            key={align}
                            onClick={() => updateBlockStyle(blockBeingEdited.id, { textAlign: align })}
                            style={{ flex: 1, padding: '8px 0', border: 'none', background: blockBeingEdited.style?.textAlign === align ? T.card : 'transparent', color: T.text, borderRadius: 6, cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                          >
                            <Layout size={14} style={{ transform: align === 'center' ? 'none' : (align === 'right' ? 'rotate(90deg)' : 'none') }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>
                    <Layers size={40} style={{ marginBottom: 16, color: T.textSub }} />
                    <div style={{ fontSize: 13, fontWeight: 600 }}>No block selected</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>Select a block in the canvas to edit</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── Chapter Management Slider (Right Drawer) ── */}
      {showChapterModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end', animation: 'fadeIn 0.2s' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowChapterModal(false)} />
          <div style={{
            backgroundColor: T.card, width: 360, height: '100%', position: 'relative', boxShadow: '-10px 0 30px rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'column', animation: 'slideLeft 0.3s ease-out', borderLeft: `1px solid ${T.border}`
          }}>
            {/* Drawer Header */}
            <div style={{ padding: '24px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.sidebar }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.primary }}>
                  <Layers size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>{editingChapterId ? 'Update Chapter' : 'Create Chapter'}</div>
                  <div style={{ fontSize: 11, color: T.textSub }}>Define your module details</div>
                </div>
              </div>
              <button onClick={() => setShowChapterModal(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'none', border: 'none', color: T.textSub, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = T.primaryBg} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}><X size={18} /></button>
            </div>

            {/* Drawer Content */}
            <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', gap: 28, overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: T.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>Chapter Name</label>
                <input
                  autoFocus
                  type="text"
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                  placeholder="e.g. Chapter 3: Advanced Diagnosis"
                  style={{ width: '100%', padding: '14px', borderRadius: 12, border: `2px solid ${T.border}`, backgroundColor: T.bg, color: T.text, outline: 'none', fontSize: 14, fontWeight: 500, transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = T.primary}
                  onBlur={(e) => e.target.style.borderColor = T.border}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: T.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>Description</label>
                <textarea
                  rows={5}
                  value={chapterForm.description}
                  onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                  placeholder="What will users learn in this chapter?"
                  style={{ width: '100%', padding: '14px', borderRadius: 12, border: `2px solid ${T.border}`, backgroundColor: T.bg, color: T.text, outline: 'none', fontSize: 14, resize: 'none', fontWeight: 500, transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = T.primary}
                  onBlur={(e) => e.target.style.borderColor = T.border}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: T.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>Tag / Level</label>
                <div style={{ position: 'relative' }}>
                  <Tag size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.textSub }} />
                  <input
                    type="text"
                    value={chapterForm.tag}
                    onChange={(e) => setChapterForm({ ...chapterForm, tag: e.target.value })}
                    placeholder="Beginner, Core, Advanced..."
                    style={{ width: '100%', padding: '14px 14px 14px 42px', borderRadius: 12, border: `2px solid ${T.border}`, backgroundColor: T.bg, color: T.text, outline: 'none', fontSize: 14, fontWeight: 500, transition: 'border-color 0.2s' }}
                    onFocus={(e) => e.target.style.borderColor = T.primary}
                    onBlur={(e) => e.target.style.borderColor = T.border}
                  />
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div style={{ padding: '24px 32px', backgroundColor: T.sidebar, borderTop: `1px solid ${T.border}`, display: 'flex', gap: 12 }}>
              <button onClick={() => setShowChapterModal(false)} style={{ flex: 1, padding: '14px', background: 'transparent', border: `1px solid ${T.border}`, color: T.text, borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}>Discard</button>
              <button onClick={handleSaveChapter} style={{ flex: 1.5, padding: '14px', backgroundColor: T.primary, border: 'none', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 15px rgba(27,111,222,0.3)', transition: 'all 0.2s' }}>{editingChapterId ? 'Apply Changes' : 'Save Chapter'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview App Slider ── */}
      {showFullPreview && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end', animation: 'fadeIn 0.3s' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setShowFullPreview(false)} />
          <div style={{
            width: 450, backgroundColor: T.bg, height: '100%', position: 'relative', boxShadow: '-10px 0 30px rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'column', animation: 'slideLeft 0.3s ease-out'
          }}>
            {/* Slider Header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: T.card }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>App Live Simulator</div>
                <div style={{ fontSize: 11, color: T.textSub, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 1.5s infinite' }} />
                  Live preview
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Theme Toggle for Preview */}
                <div style={{ display: 'flex', gap: 4, padding: 4, backgroundColor: T.sidebar, borderRadius: 10 }}>
                  <button
                    onClick={() => setPreviewTheme('light')}
                    style={{ ...toolbarBtn(previewTheme === 'light'), padding: 6 }}
                  ><Sun size={14} /></button>
                  <button
                    onClick={() => setPreviewTheme('dark')}
                    style={{ ...toolbarBtn(previewTheme === 'dark'), padding: 6 }}
                  ><Moon size={14} /></button>
                </div>
                <button onClick={() => setShowFullPreview(false)} style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: T.primaryBg, border: 'none', color: T.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: T.name === 'dark' ? '#0f172a' : '#f8fafc', padding: '20px', overflowY: 'auto' }}>
              <PhonePreview isFull={true} />
            </div>
          </div>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
            @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
            
            .chapter-actions { opacity: 0; transition: opacity 0.2s; }
            div:hover > .chapter-actions { opacity: 1; }
            
            input[type='range']::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: #1B6FDE;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 0 4px rgba(0,0,0,0.1);
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default LearningModules;
