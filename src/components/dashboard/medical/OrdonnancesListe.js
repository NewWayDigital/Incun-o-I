import React, { useState } from 'react';

function OrdonnancesListe({ ordonnances, onView, onAdd, onEdit, onDelete, hasSelectedPatient }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrdonnance, setSelectedOrdonnance] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  // Open action menu
  const handleMenuToggle = (ordonnance) => {
    setSelectedOrdonnance(ordonnance);
    setShowMenu(!showMenu);
  };

  // Handle action from menu
  const handleAction = (action) => {
    if (!selectedOrdonnance) return;

    switch (action) {
      case 'view':
        onView(selectedOrdonnance);
        break;
      case 'edit':
        onEdit(selectedOrdonnance);
        break;
      case 'delete':
        onDelete(selectedOrdonnance.id);
        break;
      default:
        break;
    }
    setShowMenu(false);
  };

  // Get status color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#3498db'; // blue
      case 'completed':
        return '#2ecc71'; // green
      default:
        return '#95a5a6'; // gray
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Terminée';
      default:
        return status;
    }
  };

  // Format date 
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    } catch (error) {
      console.error('Erreur de format de date:', error);
      return 'Date invalide';
    }
  };

  // Format medication count with proper plural form
  const formatMedicamentCount = (medicaments) => {
    if (!medicaments || !Array.isArray(medicaments)) return '0 médicament';
    const count = medicaments.length;
    return `${count} médicament${count > 1 ? 's' : ''}`;
  };

  // Filter ordonnances based on search term and status filter
  const filteredOrdonnances = ordonnances.filter(ordonnance => {
    const matchesSearch = searchTerm === '' || 
      (ordonnance.patient && ordonnance.patient.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ordonnance.medecin && ordonnance.medecin.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || ordonnance.statut === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="ordonnances-liste" style={{ 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      padding: '20px' 
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h2 style={{ margin: 0 }}>Ordonnances</h2>
        <button 
          onClick={onAdd}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <i className="fas fa-plus"></i> Nouvelle ordonnance
        </button>
      </div>

      {/* Search and Filter */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '20px',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1' }}>
          <div style={{ 
            position: 'relative',
            width: '100%'
          }}>
            <i className="fas fa-search" style={{ 
              position: 'absolute',
              left: '10px',
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#7f8c8d'
            }}></i>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '8px 15px 8px 35px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                boxSizing: 'border-box'
              }}
              disabled={!ordonnances || ordonnances.length === 0}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => handleFilterChange('all')}
            style={{
              backgroundColor: filterStatus === 'all' ? '#f1f1f1' : 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontWeight: filterStatus === 'all' ? 'bold' : 'normal'
            }}
            disabled={!ordonnances || ordonnances.length === 0}
          >
            Toutes
          </button>
          <button
            onClick={() => handleFilterChange('active')}
            style={{
              backgroundColor: filterStatus === 'active' ? '#e1f5fe' : 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontWeight: filterStatus === 'active' ? 'bold' : 'normal'
            }}
            disabled={!ordonnances || ordonnances.length === 0}
          >
            Actives
          </button>
          <button
            onClick={() => handleFilterChange('completed')}
            style={{
              backgroundColor: filterStatus === 'completed' ? '#e8f5e9' : 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontWeight: filterStatus === 'completed' ? 'bold' : 'normal'
            }}
            disabled={!ordonnances || ordonnances.length === 0}
          >
            Terminées
          </button>
        </div>
      </div>

      {/* Empty State */}
      {(!ordonnances || ordonnances.length === 0) && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#666',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px',
          margin: '20px 0'
        }}>
          <i className="fas fa-prescription" style={{ fontSize: '48px', color: '#bdc3c7', marginBottom: '15px' }}></i>
          <h3>{hasSelectedPatient ? 'Aucune ordonnance trouvée' : 'Veuillez sélectionner un patient'}</h3>
          <p>
            {hasSelectedPatient 
              ? 'Ce patient n\'a pas encore d\'ordonnances. Vous pouvez en créer une nouvelle.' 
              : 'Sélectionnez un patient dans la liste déroulante pour afficher ses ordonnances.'}
          </p>
          {hasSelectedPatient && (
            <button 
              onClick={onAdd}
              style={{
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '15px'
              }}
            >
              Créer une ordonnance
            </button>
          )}
        </div>
      )}

      {/* Ordonnances Table */}
      {filteredOrdonnances.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Patient</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Médecin</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Médicaments</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Statut</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrdonnances.map((ordonnance) => (
                <tr key={ordonnance.id} style={{ 
                  cursor: 'pointer', 
                  '&:hover': { backgroundColor: '#f9f9f9' } 
                }}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    {formatDate(ordonnance.date)}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{ordonnance.patient || 'Patient inconnu'}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{ordonnance.medecin || 'Médecin inconnu'}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    {formatMedicamentCount(ordonnance.medicaments)}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: getStatusColor(ordonnance.statut) + '20',
                      color: getStatusColor(ordonnance.statut),
                      fontWeight: 'bold',
                      fontSize: '0.8rem'
                    }}>
                      {getStatusLabel(ordonnance.statut)}
                    </span>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                      <button
                        onClick={() => onView(ordonnance)}
                        title="Voir"
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#3498db',
                          cursor: 'pointer',
                          padding: '5px',
                          borderRadius: '4px'
                        }}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={() => onEdit(ordonnance)}
                        title="Modifier"
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#f39c12',
                          cursor: 'pointer',
                          padding: '5px',
                          borderRadius: '4px'
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => onDelete(ordonnance.id)}
                        title="Supprimer"
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#e74c3c',
                          cursor: 'pointer',
                          padding: '5px',
                          borderRadius: '4px'
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : ordonnances.length > 0 && filteredOrdonnances.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#666' 
        }}>
          <p>Aucune ordonnance ne correspond à vos critères de recherche.</p>
        </div>
      ) : null}
    </div>
  );
}

export default OrdonnancesListe; 