import React, { useState, useEffect } from 'react';
import OrdonnancesListe from './OrdonnancesListe';
import OrdonnancesDetail from './OrdonnancesDetail';
import OrdonnancesForm from './OrdonnancesForm';
import ordonnanceService from '../../../services/ordonnance.service';
import { toast } from 'react-hot-toast';
import { patientService } from '../../../services/api';

// Sample data (commenté, uniquement pour référence)
/* 
const sampleOrdonnances = [
  // ... données statiques supprimées ...
];
*/

function OrdonnancesManager() {
  const [ordonnances, setOrdonnances] = useState([]);
  const [selectedOrdonnance, setSelectedOrdonnance] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'detail', 'create', 'edit'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  // Charger la liste des patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoadingPatients(true);
        const response = await patientService.getAll();
        console.log('la réponse')
        console.log(response)
        setPatients(response || []);
      } catch (err) {
        console.error('Erreur lors du chargement des patients:', err);
        setPatients([]);
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  // Load ordonnances from API
  useEffect(() => {
    // Fonction pour charger les ordonnances d'un patient
    const fetchOrdonnances = async (patientId) => {
      if (!patientId) {
        setOrdonnances([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const traitements = await ordonnanceService.getByPatient(patientId);
        
        // Format data if needed - traitement direct car nous avons déjà un tableau de traitements
        const formattedOrdonnances = traitements.map(traitement => ({
          id: traitement.id,
          date: traitement.createdAt || new Date().toISOString(),
          patient: traitement.Patient ? traitement.Patient.nom : 'Patient inconnu',
          patientId: traitement.patientId,
          medecin: traitement.medecin,
          // Pour chaque traitement, on le transforme en format "medicament" pour l'UI
          medicaments: [{ 
            nom: traitement.medicament || 'Inconnu', 
            posologie: `${traitement.dosage || ''}, ${traitement.frequence || ''}`, 
            duree: traitement.duree || '' 
          }],
          notes: traitement.notes || '',
          statut: traitement.statut || 'active',
          PatientId: traitement.patientId,
          UserId: traitement.UserId || 'U-001',
          dateCreation: traitement.createdAt,
          dateExpiration: traitement.dateExpiration
        }));
        
        setOrdonnances(formattedOrdonnances);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des ordonnances:', err);
        setError('Impossible de charger les ordonnances');
        setOrdonnances([]); // Tableau vide en cas d'erreur, pas de données statiques
        toast.error('Erreur lors du chargement des ordonnances');
      } finally {
        setLoading(false);
      }
    };

    // Si un patient est sélectionné, charger ses ordonnances
    if (selectedPatientId) {
      fetchOrdonnances(selectedPatientId);
    } else {
      // Si aucun patient n'est sélectionné, afficher un tableau vide
      setOrdonnances([]);
      setLoading(false);
    }
  }, [selectedPatientId]);

  // Handle viewing a single ordonnance
  const handleViewOrdonnance = (ordonnance) => {
    setSelectedOrdonnance(ordonnance);
    setViewMode('detail');
  };

  // Handle adding a new ordonnance
  const handleAddOrdonnance = () => {
    if (!selectedPatientId) {
      toast.error('Veuillez sélectionner un patient avant de créer une ordonnance');
      return;
    }
    setSelectedOrdonnance(null);
    setViewMode('create');
  };

  // Handle editing an ordonnance
  const handleEditOrdonnance = (ordonnance) => {
    setSelectedOrdonnance(ordonnance);
    setViewMode('edit');
  };

  // Handle deleting an ordonnance
  const handleDeleteOrdonnance = async (id) => {
    // Confirm before deleting
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette ordonnance ?")) {
      try {
        await ordonnanceService.delete(id);
        
        // Update local state
        const updatedOrdonnances = ordonnances.filter(ord => ord.id !== id);
        setOrdonnances(updatedOrdonnances);
        
        // If the deleted ordonnance is currently selected, go back to the list
        if (selectedOrdonnance && selectedOrdonnance.id === id) {
          setSelectedOrdonnance(null);
          setViewMode('list');
        }
        
        toast.success('Ordonnance supprimée avec succès');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        toast.error('Erreur lors de la suppression de l\'ordonnance');
      }
    }
  };

  // Handle going back to the list view
  const handleBackToList = () => {
    setSelectedOrdonnance(null);
    setViewMode('list');
  };

  // Handle saving an ordonnance (create or edit)
  const handleSaveOrdonnance = async (ordonnance) => {
    try {
      if (viewMode === 'create') {
        // Préparer les données pour le backend
        const medicaments = ordonnance.medicaments.map(med => ({
          medicament: med.nom,
          dosage: med.posologie.split(' ')[0], // Exemple: extraire "500mg" de "500mg, 3 fois par jour"
          frequence: med.posologie.replace(/^[^,]+,\s*/, ''), // Garder tout après la virgule
          duree: med.duree,
          medecin: ordonnance.medecin
        }));

        console.log('Données des médicaments envoyées au backend:', medicaments);
        
        // Create new ordonnance
        const patientId = ordonnance.patientId || selectedPatientId;
        if (!patientId) {
          toast.error('ID du patient requis');
          return;
        }
        
        try {
          // Ajouter plusieurs médicaments à la fois avec une seule requête
          const response = await ordonnanceService.addMultiple(patientId, medicaments);
          console.log('Réponse du backend après ajout multiple:', response);
          
          if (response && response.traitements && response.traitements.length > 0) {
            // Après l'ajout, rafraîchir les données au lieu d'essayer de mettre à jour l'état local
            // Cela garantit que nous avons les données dans le format correct du backend
            const freshData = await ordonnanceService.getByPatient(patientId);
            console.log('Nouvelles données après ajout:', freshData);
            
            // Re-formater les données pour l'UI
            const formattedOrdonnances = freshData.map(traitement => ({
              id: traitement.id,
              date: traitement.createdAt || new Date().toISOString(),
              patient: traitement.Patient ? traitement.Patient.nom : 'Patient inconnu',
              patientId: traitement.patientId,
              medecin: traitement.medecin,
              medicaments: [{ 
                nom: traitement.medicament || 'Inconnu', 
                posologie: `${traitement.dosage || ''}, ${traitement.frequence || ''}`, 
                duree: traitement.duree || '' 
              }],
              notes: traitement.notes || '',
              statut: traitement.statut || 'active',
              PatientId: traitement.patientId,
              UserId: traitement.UserId || 'U-001',
              dateCreation: traitement.createdAt,
              dateExpiration: traitement.dateExpiration
            }));
            
            setOrdonnances(formattedOrdonnances);
            toast.success('Ordonnance créée avec succès');
          } else {
            toast.warning('Création de l\'ordonnance réussie, mais données de retour incomplètes');
          }
        } catch (addError) {
          console.error('Erreur détaillée lors de l\'ajout:', addError);
          toast.error('Erreur lors de l\'ajout des médicaments: ' + (addError.message || ''));
          return;
        }
      } else if (viewMode === 'edit') {
        // Update existing ordonnance
        const traitementData = {
          medicament: ordonnance.medicaments[0].nom,
          dosage: ordonnance.medicaments[0].posologie.split(' ')[0],
          frequence: ordonnance.medicaments[0].posologie.replace(/^[^,]+,\s*/, ''),
          duree: ordonnance.medicaments[0].duree,
          medecin: ordonnance.medecin,
          notes: ordonnance.notes
        };
        
        await ordonnanceService.update(ordonnance.id, traitementData);
        
        // After updating, refresh the data instead of manually updating
        const freshData = await ordonnanceService.getByPatient(ordonnance.patientId || selectedPatientId);
        
        // Re-format the data for UI
        const formattedOrdonnances = freshData.map(traitement => ({
          id: traitement.id,
          date: traitement.createdAt || new Date().toISOString(),
          patient: traitement.Patient ? traitement.Patient.nom : 'Patient inconnu',
          patientId: traitement.patientId,
          medecin: traitement.medecin,
          medicaments: [{ 
            nom: traitement.medicament || 'Inconnu', 
            posologie: `${traitement.dosage || ''}, ${traitement.frequence || ''}`, 
            duree: traitement.duree || '' 
          }],
          notes: traitement.notes || '',
          statut: traitement.statut || 'active',
          PatientId: traitement.patientId,
          UserId: traitement.UserId || 'U-001',
          dateCreation: traitement.createdAt,
          dateExpiration: traitement.dateExpiration
        }));
        
        setOrdonnances(formattedOrdonnances);
        toast.success('Ordonnance mise à jour avec succès');
      }
      
      // Go back to list after saving
      setViewMode('list');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de l\'ordonnance');
    }
  };

  // Gestionnaire pour le changement de patient sélectionné
  const handlePatientChange = (e) => {
    const patientId = e.target.value;
    setSelectedPatientId(patientId === "" ? null : patientId);
  };

  // Render loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Chargement des ordonnances...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '10px',
            padding: '8px 15px',
            backgroundColor: '#f1f1f1',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Render appropriate component based on viewMode
  const renderContent = () => {
    switch (viewMode) {
      case 'detail':
        return (
          <OrdonnancesDetail 
            ordonnance={selectedOrdonnance} 
            onBack={handleBackToList}
          />
        );
      case 'create':
      case 'edit':
        return (
          <OrdonnancesForm
            ordonnance={viewMode === 'edit' ? selectedOrdonnance : null}
            onSave={handleSaveOrdonnance}
            onCancel={handleBackToList}
            selectedPatientId={selectedPatientId}
          />
        );
      case 'list':
      default:
        return (
          <OrdonnancesListe 
            ordonnances={ordonnances}
            onView={handleViewOrdonnance}
            onAdd={handleAddOrdonnance}
            onEdit={handleEditOrdonnance}
            onDelete={handleDeleteOrdonnance}
            hasSelectedPatient={!!selectedPatientId}
          />
        );
    }
  };

  return (
    <div className="main-content" id="main-content">
      <div className="topbar">
        <h1 className="page-title">Gestion des ordonnances</h1>
      </div>
      <div className="dashboard-content">
        {/* Patient selector */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="patient-select" style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold' 
          }}>
            Sélectionner un patient:
          </label>
          <select 
            id="patient-select"
            value={selectedPatientId || ""}
            onChange={handlePatientChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white'
            }}
            disabled={loadingPatients || viewMode !== 'list'}
          >
            <option value="">-- Sélectionner un patient --</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.nom || 'Patient inconnu'}
              </option>
            ))}
          </select>
          {loadingPatients && (
            <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#666' }}>
              Chargement des patients...
            </p>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default OrdonnancesManager; 