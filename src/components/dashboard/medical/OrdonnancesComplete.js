import React, { useState } from 'react';
import OrdonnancesListe from './OrdonnancesListe';
import OrdonnancesFormulaire from './OrdonnancesFormulaire';

function OrdonnancesComplete() {
  const [activeTab, setActiveTab] = useState('liste');

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Gestion des ordonnances</h2>
      
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}>
        {/* Tabs Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #eee',
          backgroundColor: '#f9f9f9'
        }}>
          <button 
            onClick={() => setActiveTab('liste')}
            style={{
              padding: '15px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'liste' ? '2px solid #3498db' : 'none',
              color: activeTab === 'liste' ? '#3498db' : '#333',
              fontWeight: activeTab === 'liste' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            Liste des ordonnances
          </button>
          <button 
            onClick={() => setActiveTab('nouvelle')}
            style={{
              padding: '15px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'nouvelle' ? '2px solid #3498db' : 'none',
              color: activeTab === 'nouvelle' ? '#3498db' : '#333',
              fontWeight: activeTab === 'nouvelle' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            Nouvelle ordonnance
          </button>
        </div>
        
        {/* Tab Content */}
        <div>
          {activeTab === 'liste' ? (
            <OrdonnancesListe />
          ) : (
            <OrdonnancesFormulaire />
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdonnancesComplete; 