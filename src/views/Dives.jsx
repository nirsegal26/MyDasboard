import React, { useState } from 'react';

import whaleImg from '../assets/whale.webp';
import orcaImg from '../assets/orca.webp';
import seaTurtleImg from '../assets/sea-turtle.webp';
import whaleSharkImg from '../assets/whale_shark.webp';
import seahorseImg from '../assets/horsea.webp';
import stingrayImg from '../assets/eagle_ray.webp';
import mantaRayImg from '../assets/manta.webp';
import dolphinImg from '../assets/dolphin.webp';
import octopusImg from '../assets/octopus.webp';

const MARINE_ANIMALS = [
    { id: 'whale', name: 'לוויתן', src: whaleImg },
    { id: 'orca', name: 'אורקה', src: orcaImg },
    { id: 'sea-turtle', name: 'צב ים', src: seaTurtleImg },
    { id: 'whale-shark', name: 'כריש לוויתן', src: whaleSharkImg },
    { id: 'seahorse', name: 'סוסון ים', src: seahorseImg },
    { id: 'stingray', name: 'חתול ים', src: stingrayImg },
    { id: 'manta-ray', name: 'מנטה ריי', src: mantaRayImg },
    { id: 'dolphin', name: 'דולפין', src: dolphinImg },
    { id: 'octopus', name: 'תמנון', src: octopusImg }
];

export default function Dives({ seenAnimals, onSave, onRemove }) {
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [hoveredAnimal, setHoveredAnimal] = useState(null);

    const handleAnimalClick = (animal) => {
        const existing = seenAnimals.find(a => (typeof a === 'object' ? a.id === animal.id : a === animal.id));
        if (existing && typeof existing === 'object') {
            setLocation(existing.location || '');
            setDate(existing.date || '');
        } else {
            setLocation('');
            setDate('');
        }
        setSelectedAnimal(animal);
    };

    const handleSave = () => {
        onSave({ id: selectedAnimal.id, location: location.trim(), date });
        setSelectedAnimal(null);
    };

    const handleRemove = () => {
        onRemove(selectedAnimal.id);
        setSelectedAnimal(null);
    };

    return (
        <div className="card view-card" style={{ 
            padding: '25px', 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%', 
            minHeight: 0,
            maxWidth: '1200px', 
            margin: '0 auto', 
            width: '100%'
        }}>
            
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center', 
                gap: '20px',
                overflowY: 'auto',
                flex: 1,
                padding: '10px 5px'
            }}>
                {MARINE_ANIMALS.map(animal => {
                    const existingData = seenAnimals.find(a => (typeof a === 'object' ? a.id === animal.id : a === animal.id));
                    const isSeen = !!existingData;
                    const hasDetails = isSeen && typeof existingData === 'object' && (existingData.location || existingData.date);
                    
                    return (
                        <div 
                            key={animal.id} 
                            onClick={() => handleAnimalClick(animal)}
                            onMouseEnter={() => setHoveredAnimal(animal.id)}
                            onMouseLeave={() => setHoveredAnimal(null)}
                            style={{
                                width: 'calc(20% - 16px)', 
                                minWidth: '110px',
                                flexGrow: 0,
                                flexShrink: 0,
                                position: 'relative',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                aspectRatio: '1',
                                boxShadow: isSeen ? '0 4px 15px rgba(79, 209, 197, 0.4)' : '0 4px 6px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                border: isSeen ? '2px solid var(--accent-teal)' : '2px solid transparent'
                            }}
                        >
                            <img 
                                src={animal.src} 
                                alt={animal.name} 
                                loading="lazy" 
                                decoding="async"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: isSeen ? 'grayscale(0%)' : 'grayscale(100%)',
                                    transition: 'filter 0.5s ease',
                                    opacity: isSeen ? 1 : 0.6
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: isSeen ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
                                padding: '10px',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}>
                                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>{animal.name}</span>
                                {isSeen && <i className="fa-solid fa-check" style={{ color: 'var(--accent-teal)' }}></i>}
                            </div>

                            {/* חלון פרטים בשיריחןף */}
                            {hoveredAnimal === animal.id && hasDetails && (
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'rgba(30, 41, 59, 0.95)',
                                    color: 'white',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    pointerEvents: 'none',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                    zIndex: 10,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '5px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    {existingData.location && <div><i className="fa-solid fa-location-dot" style={{color: 'var(--accent-teal)', marginLeft: '5px'}}></i> {existingData.location}</div>}
                                    {existingData.date && <div><i className="fa-regular fa-calendar" style={{color: 'var(--accent-orange)', marginLeft: '5px'}}></i> {existingData.date.split('-').reverse().join('/')}</div>}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal תיעוד תצפית */}
            {selectedAnimal && (
                <div className="modal-overlay" onClick={() => setSelectedAnimal(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <span><i className="fa-solid fa-camera-retro" style={{marginLeft: '10px'}}></i> תיעוד תצפית: {selectedAnimal.name}</span>
                            <button className="icon-btn" onClick={() => setSelectedAnimal(null)}>
                                <i className="fa-solid fa-xmark" style={{fontSize: '20px'}}></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>מיקום הצלילה :</label>
                                <input 
                                    autoFocus 
                                    type="text" 
                                    value={location} 
                                    onChange={(e) => setLocation(e.target.value)} 
                                    className="inline-edit-input"
                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '14px' }}
                                />
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>תאריך התצפית:</label>
                                <input 
                                    type="date" 
                                    value={date} 
                                    onChange={(e) => setDate(e.target.value)} 
                                    className="inline-edit-input"
                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '14px', fontFamily: 'inherit' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave}>שמור תצפית</button>
                                {seenAnimals.find(a => (typeof a === 'object' ? a.id === selectedAnimal.id : a === selectedAnimal.id)) && (
                                    <button className="btn-danger" style={{ flex: 1 }} onClick={handleRemove}>הסר תצפית</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}