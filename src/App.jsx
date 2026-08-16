import { useState } from 'react';
import { useDashboardData, getDateString } from './hooks/useDashboardData';
import Dashboard from './views/Dashboard';
import Tasks from './views/Tasks';
import Statistics from './views/Statistics';
import Goals from './views/Goals';
import FullCalendar from './views/FullCalendar';
import CustomPage from './views/CustomPage';
import { CalendarTooltipManager } from './components/CalendarTooltipManager';
import Dives from './views/Dives';

function App() {
  const [state, setState] = useDashboardData();
  const [currentView, setCurrentView] = useState('dashboard');
  
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  
  const todayStr = getDateString(new Date());

  // פונקציית גרירה שדואגת לשמור את הסדר החדש במערכת
  const handleReorder = (collection, newArray, customPageId = null) => {
    setState(prev => {
        if (collection === 'custom') {
            return {
                ...prev,
                customPages: (prev.customPages || []).map(p => 
                    p.id === customPageId ? { ...p, tasks: newArray } : p
                )
            };
        }
        return { ...prev, [collection]: newArray };
    });
  };

  const handleToggle = (id, collection, customPageId = null) => {
    setState(prevState => {
      if (collection === 'custom') {
        return {
          ...prevState,
          customPages: (prevState.customPages || []).map(p => {
              if (p.id === customPageId) {
                  let updatedTasks = p.tasks.map(t => 
                      t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? todayStr : null } : t
                  );
                  // מיון אוטומטי: פתוחות למעלה, סגורות למטה
                  updatedTasks = [...updatedTasks.filter(t => !t.completed), ...updatedTasks.filter(t => t.completed)];
                  return { ...p, tasks: updatedTasks };
              }
              return p;
          })
        };
      }
      
      let newArray = prevState[collection].map(item => {
        if (item.id === id) {
          if (collection === 'habits') {
            const dates = item.completedDates || [];
            return { ...item, completedDates: dates.includes(todayStr) ? dates.filter(d => d !== todayStr) : [...dates, todayStr] };
          }
          return { ...item, completed: !item.completed, completedAt: !item.completed ? todayStr : null };
        }
        return item;
      });

      // מיון אוטומטי במשימות ובמטרות
      if (collection === 'tasks' || collection === 'goals') {
          newArray = [...newArray.filter(item => !item.completed), ...newArray.filter(item => item.completed)];
      }

      return { ...prevState, [collection]: newArray };
    });
  };

  const handleDelete = (id, collection, customPageId = null) => {
    setState(prevState => {
      let itemToDelete = null;

      if (collection === 'custom') {
        const page = prevState.customPages.find(p => p.id === customPageId);
        if (page) itemToDelete = page.tasks.find(t => t.id === id);
      } else {
        itemToDelete = (prevState[collection] || []).find(item => item.id === id);
      }

      // שמירה לארכיון אם המשימה הוגדרה כהושלמה לפני שמחקו אותה
      let newArchive = prevState.archive || [];
      if (itemToDelete && itemToDelete.completed) {
        newArchive = [...newArchive, { ...itemToDelete, archivedFrom: collection }];
      }

      if (collection === 'custom') {
        return { 
          ...prevState, 
          archive: newArchive,
          customPages: prevState.customPages.map(p => p.id === customPageId ? { ...p, tasks: p.tasks.filter(t => t.id !== id) } : p) 
        };
      }
      
      return { 
        ...prevState, 
        archive: newArchive,
        [collection]: prevState[collection].filter(item => item.id !== id) 
      };
    });
  };

  const handleEdit = (id, collection, newText, customPageId = null) => {
    setState(prevState => {
      if (collection === 'custom') {
        return { ...prevState, customPages: prevState.customPages.map(p => p.id === customPageId ? { ...p, tasks: p.tasks.map(t => t.id === id ? { ...t, title: newText } : t) } : p) };
      }
      return { ...prevState, [collection]: prevState[collection].map(item => item.id === id ? { ...item, [item.title !== undefined ? 'title' : 'name']: newText } : item) };
    });
  };

  const handleAdd = (collection, newItem) => {
    setState(prevState => {
      if (collection === 'custom') {
        return { ...prevState, customPages: prevState.customPages.map(p => p.id === newItem.pageId ? { ...p, tasks: [...p.tasks, newItem.task] } : p) };
      }
      return { ...prevState, [collection]: [...(prevState[collection] || []), newItem] };
    });
  };

  const handleSaveMarineAnimal = (animalData) => {
      setState(prev => {
          const currentAnimals = prev.marineAnimals || [];
          const filtered = currentAnimals.filter(a => (typeof a === 'object' ? a.id : a) !== animalData.id);
          return { ...prev, marineAnimals: [...filtered, animalData] };
      });
  };

  const handleRemoveMarineAnimal = (animalId) => {
    setState(prev => {
        const currentAnimals = prev.marineAnimals || [];
        return { ...prev, marineAnimals: currentAnimals.filter(a => (typeof a === 'object' ? a.id : a) !== animalId) };
    });
  };

  const handleAddPageSubmit = () => {
    if (newPageTitle.trim()) {
        const newPage = { id: 'page_' + Date.now(), title: newPageTitle.trim(), tasks: [] };
        setState(prev => ({ ...prev, customPages: [...(prev.customPages || []), newPage] }));
        setCurrentView(newPage.id);
    }
    setIsAddingPage(false);
    setNewPageTitle('');
  };

  const handleDeletePage = (pageId) => {
    if(confirm('האם אתה בטוח שברצונך למחוק דף זה וכל משימותיו?')) {
        setState(prev => ({ ...prev, customPages: prev.customPages.filter(p => p.id !== pageId) }));
        setCurrentView('dashboard');
    }
  };

  const viewTitles = { 'dashboard': 'הדשבורד שלי', 'tasks': 'משימות כלליות', 'calendar': 'לוח שנה', 'statistics': 'סטטיסטיקה וניתוח ביצועים', 'goals': 'מטרות ויעדים קדימה', 'dives': 'יומן תצפיות צלילה' };
  const viewSubtitles = { 'dashboard': new Date().toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), 'statistics': 'מעקב אחר עקביות, מומנטום והתפלגות משימות'};

  const activeCustomPage = (state.customPages || []).find(p => p.id === currentView);

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo"><i className="fa-solid fa-layer-group"></i></div>
        <div className="nav-links">
          <button className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}><i className="fa-solid fa-house"></i> דשבורד ראשי</button>
          <button className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`} onClick={() => setCurrentView('calendar')}><i className="fa-regular fa-calendar"></i> לוח שנה</button>
          <button className={`nav-item ${currentView === 'tasks' ? 'active' : ''}`} onClick={() => setCurrentView('tasks')}><i className="fa-solid fa-list-check"></i> משימות כלליות</button>
          <button className={`nav-item ${currentView === 'goals' ? 'active' : ''}`} onClick={() => setCurrentView('goals')}><i className="fa-solid fa-bullseye"></i> מטרות ויעדים</button>
          <button className={`nav-item ${currentView === 'dives' ? 'active' : ''}`} onClick={() => setCurrentView('dives')}><i className="fa-solid fa-water"></i> יומן צלילות</button>
          <button className={`nav-item ${currentView === 'statistics' ? 'active' : ''}`} onClick={() => setCurrentView('statistics')}><i className="fa-solid fa-chart-pie"></i> סטטיסטיקה</button>
          
          <div className="divider"></div>
          <div className="sidebar-subtitle">דפים מותאמים</div>
          
          {(state.customPages || []).map(page => (
            <button key={page.id} className={`nav-item ${currentView === page.id ? 'active' : ''}`} onClick={() => setCurrentView(page.id)}>
              <i className="fa-regular fa-folder"></i> {page.title}
            </button>
          ))}
          
          {isAddingPage ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px' }}>
                <input 
                    type="text" 
                    autoFocus
                    value={newPageTitle} 
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddPageSubmit();
                        if (e.key === 'Escape') { setIsAddingPage(false); setNewPageTitle(''); }
                    }}
                    placeholder="שם הדף..." 
                    style={{ padding: '8px 12px', fontSize: '14px', borderRadius: '6px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-primary" style={{ padding: '8px 0', fontSize: '13px', flex: 1 }} onClick={handleAddPageSubmit}>שמור</button>
                    <button className="btn-secondary" style={{ padding: '8px 0', fontSize: '13px', flex: 1 }} onClick={() => { setIsAddingPage(false); setNewPageTitle(''); }}>בטל</button>
                </div>
            </div>
          ) : (
            <button className="nav-item add-page-btn" onClick={() => setIsAddingPage(true)}><i className="fa-solid fa-plus"></i> דף חדש...</button>
          )}
        </div>
      </aside>

      <main className="main-content">
        <section className="view active">
          <header className="header">
            <div>
              <h1>{activeCustomPage ? activeCustomPage.title : viewTitles[currentView]}</h1>
              {!activeCustomPage && viewSubtitles[currentView] && <div className="header-subtitle">{viewSubtitles[currentView]}</div>}
            </div>
            {activeCustomPage && (
              <button className="btn-danger" style={{padding: '6px 12px', fontSize: '13px'}} onClick={() => handleDeletePage(activeCustomPage.id)}>
                <i className="fa-solid fa-trash" style={{marginLeft: '6px'}}></i> מחק דף
              </button>
            )}
          </header>

          {/* שים לב לתוספת של onReorder={handleReorder} לקומפוננטות */}
          {currentView === 'dashboard' && <Dashboard state={state} todayStr={todayStr} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} onAdd={handleAdd} onNavigate={setCurrentView} />}
          {currentView === 'tasks' && <Tasks tasks={state.tasks || []} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} onAdd={handleAdd} onReorder={handleReorder} />}
          {currentView === 'statistics' && <Statistics state={state} todayStr={todayStr} />}
          {currentView === 'goals' && <Goals goals={state.goals || []} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} onAdd={handleAdd} onReorder={handleReorder} />}
          {currentView === 'calendar' && <FullCalendar tasks={state.tasks || []} onAdd={handleAdd} />}
          {activeCustomPage && <CustomPage page={activeCustomPage} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} onAdd={handleAdd} onReorder={handleReorder} />}
          {currentView === 'dives' && <Dives seenAnimals={state.marineAnimals || []} onSave={handleSaveMarineAnimal} onRemove={handleRemoveMarineAnimal} />}
        </section>
      </main>

      <CalendarTooltipManager tasks={state.tasks || []} />
    </>
  );
}

export default App;