import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

function OrdonnancesDetail({ ordonnance, onBack }) {
  const componentRef = useRef();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Ordonnance-${ordonnance?.patient}-${formatDate(ordonnance?.date)}`,
    removeAfterPrint: true,
  });

  // If no prescription is selected, show a message
  if (!ordonnance) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p style={{ fontSize: '16px', color: '#666' }}>Aucune ordonnance sélectionnée</p>
        <button 
          onClick={onBack}
          style={{
            marginTop: '15px',
            padding: '8px 15px',
            backgroundColor: '#f1f1f1',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <i className="fas fa-arrow-left"></i> Retour à la liste
        </button>
      </div>
    );
  }

  // Get status color
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

  return (
    <div style={{ 
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={onBack}
            style={{
              marginRight: '15px',
              padding: '8px 15px',
              backgroundColor: '#f1f1f1',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <i className="fas fa-arrow-left"></i> Retour
          </button>
          <h2 style={{ margin: 0 }}>Détails de l'ordonnance</h2>
        </div>
        <button 
          onClick={handlePrint}
          style={{
            padding: '8px 15px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <i className="fas fa-print"></i> Imprimer
        </button>
      </div>

      {/* Status and Reference */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <div>
          <p style={{ margin: '2px 0', color: '#7f8c8d', fontSize: '14px' }}>
            Référence: {ordonnance.id}
          </p>
          <p style={{ margin: '2px 0', color: '#7f8c8d', fontSize: '14px' }}>
            Date: {formatDate(ordonnance.date)}
          </p>
        </div>
        <span style={{
          display: 'inline-block',
          padding: '5px 10px',
          borderRadius: '4px',
          backgroundColor: getStatusColor(ordonnance.statut) + '20',
          color: getStatusColor(ordonnance.statut),
          fontWeight: 'bold'
        }}>
          {getStatusLabel(ordonnance.statut)}
        </span>
      </div>

      {/* Printable content */}
      <div ref={componentRef} style={{ padding: '15px' }}>
        {/* Print header - only visible when printing */}
        <div className="print-only" style={{ textAlign: 'center', marginBottom: '30px', display: 'none' }}>
          <h1 style={{ marginBottom: '5px' }}>ORDONNANCE MÉDICALE</h1>
          <p>Référence: {ordonnance.id} | Date: {formatDate(ordonnance.date)}</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          {/* Patient Information */}
          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
              Patient
            </h3>
            <div style={{ 
              padding: '15px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}>
              <p style={{ margin: '5px 0' }}><strong>Nom:</strong> {ordonnance.patient}</p>
              {ordonnance.patientId && (
                <p style={{ margin: '5px 0' }}><strong>ID:</strong> {ordonnance.patientId}</p>
              )}
            </div>
          </div>

          {/* Doctor Information */}
          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
              Médecin
            </h3>
            <div style={{ 
              padding: '15px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}>
              <p>{ordonnance.medecin}</p>
            </div>
          </div>
        </div>

        {/* Medications section */}
        <div style={{ marginTop: '30px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
            Médicaments prescrits
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                    Médicament
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                    Posologie
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                    Durée
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordonnance.medicaments.map((med, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{med.nom}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{med.posologie}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{med.duree}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes section */}
        {ordonnance.notes && (
          <div style={{ marginTop: '30px', marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
              Notes et instructions
            </h3>
            <div style={{ 
              padding: '15px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}>
              <p style={{ whiteSpace: 'pre-line' }}>{ordonnance.notes}</p>
            </div>
          </div>
        )}

        {/* Signature section */}
        <div style={{ 
          marginTop: '30px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div style={{ 
            textAlign: 'center',
            width: '200px' 
          }}>
            <p style={{ fontSize: '14px', marginBottom: '10px' }}>Signature du médecin</p>
            <div style={{ 
              height: '60px',
              borderBottom: '1px solid #ccc',
              marginBottom: '10px'
            }}></div>
            <p style={{ fontSize: '14px' }}>{ordonnance.medecin}</p>
          </div>
        </div>
      </div>

      {/* Print styles that only apply when printing */}
      <style jsx="true">{`
        @media print {
          body {
            background-color: white;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Hide elements not needed for printing */
          button, 
          .no-print {
            display: none !important;
          }
          
          /* Show print-only elements */
          .print-only {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

export default OrdonnancesDetail; 