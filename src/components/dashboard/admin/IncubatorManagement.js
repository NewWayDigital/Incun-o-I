import React, {useEffect, useState } from 'react';
import '../../../styles/AdminDashboard.css';
import axios from 'axios'
// Configuration d'axios pour le backend
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});
// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Le serveur a répondu avec un statut d'erreur
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      return Promise.reject({ message: 'Erreur de connexion au serveur' });
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      return Promise.reject({ message: 'Erreur lors de la configuration de la requête' });
    }
  }
);
const IncubatorManagement = () => {
  const [showAddIncubatorModal, setShowAddIncubatorModal] = useState(false);
  const [showEditIncubatorModal, setShowEditIncubatorModal] = useState(false);
  // État pour les données du formulaire d'ajout d'incubateur
  const [newIncubatorData, setNewIncubatorData] = useState({
    id: '',
    model: '',
    status: 'available',
    location: '',
    patient: '-',
    lastMaintenance: ''
  });
  // Mock data - would be replaced with actual API calls in a real application
    const [patients, setPatient] = useState([]);
  
    useEffect(() => {
      api.get('patient')
        .then(response => {
          setPatient(response.data); // adapte selon la structure de ton backend
        })
        .catch(err => {
          alert(err.message || "Erreur lors du chargement des utilisateurs.");
        });
    }, []);
    

  // État pour l'incubateur en cours d'édition
  const [editingIncubator, setEditingIncubator] = useState(null);

  // Récupération des incubateurs
  const [incubators, setIncubators] = useState([]);
  useEffect(() => {
    const fetchIncubators = async () => {
      try {
        const response = await api.get('incubateur');
        setIncubators(response.data);
      } catch (error) {
        console.error(error.message)
      }
    };
    fetchIncubators();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'in-use': return 'status-in-use';
      case 'maintenance': return 'status-maintenance';
      case 'available': return 'status-available';
      case 'error': return 'status-error';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'in-use': return 'En utilisation';
      case 'maintenance': return 'En maintenance';
      case 'available': return 'Disponible';
      case 'error': return 'Erreur';
      default: return status;
    }
  };

  // Convertir modèle pour l'affichage dans le formulaire
  const getModelValue = (model) => {
    if (model === 'Incuneo-I Pro X3') return 'pro-x3';
    if (model === 'Incuneo-I Pro X2') return 'pro-x2';
    if (model === 'Incuneo-I Standard') return 'standard';
    return '';
  }

  // Convertir modèle pour l'affichage dans le tableau
  const getModelLabel = (modelValue) => {
    if (modelValue === 'pro-x3') return 'Incuneo-I Pro X3';
    if (modelValue === 'pro-x2') return 'Incuneo-I Pro X2';
    if (modelValue === 'standard') return 'Incuneo-I Standard';
    return modelValue;
  }

  // Gérer les changements dans le formulaire d'ajout
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIncubatorData({...newIncubatorData, [name]: value});
  };

  // Gérer les changements dans le formulaire d'édition
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingIncubator({...editingIncubator, [name]: value});
  };

  // Ajouter un nouvel incubateur
  const handleAddIncubator = () => {
    // Validation de base
    if (
      !newIncubatorData.id || 
      !newIncubatorData.model || 
      !newIncubatorData.location || 
      !newIncubatorData.lastMaintenance
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Vérifier que l'ID est unique
    if (incubators.some(incubator => incubator.id === newIncubatorData.id)) {
      alert("Un incubateur avec cet ID existe déjà.");
      return;
    }

    // Créer un nouvel incubateur
    const newIncubator = {
      id: newIncubatorData.id,
      model: getModelLabel(newIncubatorData.model),
      status: newIncubatorData.status,
      location: newIncubatorData.location,
      patient: newIncubatorData.status === 'in-use' ? newIncubatorData.patient : `vide ${incubators.length+Math.random(0,9)}`,
      lastMaintenance: newIncubatorData.lastMaintenance,
      saturationOxy:"vide",
      humidite:"vide",
      temperature:"vide"
    };

    // Ajouter l'incubateur à la liste
    api.post('incubateur', newIncubator)
      .then(response => {
        // Ajouter le nouveau patient à la liste
        setIncubators([...incubators, newIncubator]);
        // Simuler un ajout côté serveur
        alert(`Nouvel incubateur ${newIncubator.model} ajouté avec succès !`);
      })
      .catch(err => {
        alert(err.message || "Erreur lors du chargement des incubateur.");
      });
    

    // Réinitialiser le formulaire
    setNewIncubatorData({
      id: '',
      model: '',
      status: 'available',
      location: '',
      patient: '-',
      lastMaintenance: ''
    });

    // Fermer le modal
    setShowAddIncubatorModal(false);
  };

  // Supprimer un incubateur
  const handleDeleteIncubator = (incubatorId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet incubateur ?")) {
        api.delete(`incubateur/${incubatorId}`)
          .then(() => {
            setIncubators(incubators.filter(incubator => incubator.id !== incubatorId));
          })
          .catch(err => {
            alert(err.message || "Erreur lors de la suppression de l'incubateur.");
          });
      
    }
  };

  // Ouvrir le modal d'édition avec les données de l'incubateur
  const handleOpenEditModal = (incubator) => {
    setEditingIncubator({
      ...incubator,
      model: getModelValue(incubator.model)
    });
    setShowEditIncubatorModal(true);
  };

  // Mettre à jour un incubateur
  const handleUpdateIncubator = () => {
    // Validation de base
    if (
      !editingIncubator.id || 
      !editingIncubator.model || 
      !editingIncubator.location || 
      !editingIncubator.lastMaintenance
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Mise à jour de l'incubateur
    // Envoi de la mise à jour au serveur (utilise PUT ou PATCH selon ton API)
    api.put(`incubateur/${editingIncubator.id}`, editingIncubator)
      .then(response => {
        // Mise à jour du patient dans le state
        setIncubators(incubators.map(incubator => 
          incubator.id === editingIncubator.id 
            ? {
                ...editingIncubator,
                model: getModelLabel(editingIncubator.model),
                patient: editingIncubator.status === 'in-use' ? editingIncubator.patient : `vide ${incubators.length+Math.random(0,9)}`
              } 
            : incubator
        ));
      })
      .catch(err => {
        alert(err.message || "Erreur lors de la mise à jour de l'incubateur.");
      });

    // Fermer le modal
    setShowEditIncubatorModal(false);
    setEditingIncubator(null);
  };

  return (
    <>
      <div className="dashboard-row">
        <div className="card card-span-12">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-baby-carriage card-title-icon"></i>
              Gestion des incubateurs
            </h2>
            <button className="btn btn-success" onClick={() => setShowAddIncubatorModal(true)}>
              <i className="fas fa-plus btn-icon"></i>
              Ajouter un incubateur
            </button>
          </div>
          <div className="card-body">
            <table className="incubator-list">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Modèle</th>
                  <th>Statut</th>
                  <th>Emplacement</th>
                  <th>Patient</th>
                  <th>Dernière maintenance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incubators.map(incubator => (
                  <tr key={incubator.id}>
                    <td>{incubator.id}</td>
                    <td>{incubator.model}</td>
                    <td>
                      <span className={`incubator-status-badge ${getStatusBadgeClass(incubator.status)}`}>
                        {getStatusLabel(incubator.status)}
                      </span>
                    </td>
                    <td>{incubator.location}</td>
                    <td>{incubator.patient}</td>
                    <td>{incubator.lastMaintenance}</td>
                    <td>
                      <div className="incubator-actions">
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleOpenEditModal(incubator)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteIncubator(incubator.id)}
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
          <div className="card-footer">
            <div>Affichage de {incubators.length} incubateurs</div>
            <div>
              <button className="btn btn-primary">Voir tous les incubateurs</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'ajout d'incubateur */}
      <div className={`modal ${showAddIncubatorModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Ajouter un incubateur</h3>
            <button className="modal-close" onClick={() => setShowAddIncubatorModal(false)}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">ID de l'incubateur</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: INC-006" 
                name="id"
                value={newIncubatorData.id}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Modèle</label>
              <select 
                className="form-select"
                name="model"
                value={newIncubatorData.model}
                onChange={handleInputChange}
              >
                <option value="">Sélectionner un modèle</option>
                <option value="pro-x3">Incuneo-I Pro X3</option>
                <option value="pro-x2">Incuneo-I Pro X2</option>
                <option value="standard">Incuneo-I Standard</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Emplacement</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Salle 104 - Néonatalogie" 
                name="location"
                value={newIncubatorData.location}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date de dernière maintenance</label>
              <input 
                type="date" 
                className="form-input" 
                name="lastMaintenance"
                value={newIncubatorData.lastMaintenance}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Statut initial</label>
              <select 
                className="form-select"
                name="status"
                value={newIncubatorData.status}
                onChange={handleInputChange}
              >
                <option value="available">Disponible</option>
                <option value="maintenance">En maintenance</option>
                <option value="in-use">En utilisation</option>
              </select>
            </div> 
            {/* option select */}
            {newIncubatorData.status === 'in-use' && (
               <div className="form-group">
               <label className="form-label">Patient</label>
               <select 
                 className="form-select"
                 name="patient"
                 value={newIncubatorData.patient}
                 onChange={handleInputChange}
               >
                <option>--Selectioner un patient--</option>
                 {patients.map(p=>(
                  <option key={p.id} value={p.nom}>{p.nom}</option>
                 ))}
               </select>
             </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={() => setShowAddIncubatorModal(false)}>Annuler</button>
            <button className="btn btn-success" onClick={handleAddIncubator}>Ajouter l'incubateur</button>
          </div>
        </div>
      </div>

      {/* Modal de modification d'incubateur */}
      {editingIncubator && (
        <div className={`modal ${showEditIncubatorModal ? 'show' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Modifier l'incubateur {editingIncubator.id}</h3>
              <button className="modal-close" onClick={() => setShowEditIncubatorModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">ID de l'incubateur</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="id"
                  value={editingIncubator.id}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Modèle</label>
                <select 
                  className="form-select"
                  name="model"
                  value={editingIncubator.model}
                  onChange={handleEditInputChange}
                >
                  <option value="">Sélectionner un modèle</option>
                  <option value="pro-x3">Incuneo-I Pro X3</option>
                  <option value="pro-x2">Incuneo-I Pro X2</option>
                  <option value="standard">Incuneo-I Standard</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Emplacement</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="location"
                  value={editingIncubator.location}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date de dernière maintenance</label>
                <input 
                  type="date" 
                  className="form-input" 
                  name="lastMaintenance"
                  value={editingIncubator.lastMaintenance}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Statut</label>
                <select 
                  className="form-select"
                  name="status"
                  value={editingIncubator.status}
                  onChange={handleEditInputChange}
                >
                  <option value="available">Disponible</option>
                  <option value="maintenance">En maintenance</option>
                  <option value="in-use">En utilisation</option>
                  <option value="error">Erreur</option>
                </select>
              </div>
              {editingIncubator.status === 'in-use' && (
                <div className="form-group">
                <label className="form-label">Patient</label>
                <select 
                  className="form-select"
                  name="patient"
                  value={editingIncubator.patient}
                  onChange={handleEditInputChange}
                >
                 <option>--Selectioner un patient--</option>
                  {patients.map(p=>(
                   <option key={p.id} value={p.nom}>{p.nom}</option>
                  ))}
                </select>
              </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={() => setShowEditIncubatorModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleUpdateIncubator}>Enregistrer les modifications</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IncubatorManagement; 
