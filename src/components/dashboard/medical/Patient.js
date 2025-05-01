import React, { useEffect, useState } from 'react';
import '../../../styles/dashboard/Components.css';
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom';
import { calculerAge, formaterDate } from '../../../utils/dateUtils';
// Configuration d'axios pour le backend
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});
//la copie copie
function Patient() {
  const { id } = useParams(); // Récupère l'ID du patient depuis l'URL
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('liste');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewMode, setViewMode] = useState('default'); // 'default', 'detail', 'edit'
  const [patientForm, setPatientForm] = useState({
    id: '',
    nom: '',
    dateNaissance: '',
    sexe: '',
    poids: '',
    taille: '',
    incubateur: '',
    parent: '',
    telephone: '',
    email: '',
    adresse: '',
    groupeSanguin: '',
    allergies: '',
    noteMedicale: '',
    antecedents: '',
    status: 'stable' // Statut par défaut
  });

  const [patients, setPatients] = useState([]);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/patient');
        setPatients(response.data);

        // Si un ID est fourni dans l'URL, chercher et afficher ce patient
        if (id) {
          const patientById = response.data.find(patient => patient.id === parseInt(id));
          if (patientById) {
            setSelectedPatient(patientById);
            setViewMode('detail');
          } else {
            console.error(`Patient avec ID ${id} non trouvé`);
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchPatients();
  }, [id]); // Dépend de l'ID pour relancer le chargement si l'ID change
  // Filtrer les patients en fonction du terme de recherche
  const filteredPatients = patients.filter(patient => {
    if (!searchTerm) return true;
    return (
      patient.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.incubateur.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Fonction pour ouvrir le dossier détaillé du patient
  const handleViewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setViewMode('detail');
  };

  // Calculer l'âge du patient
  const getPatientAge = (dateNaissance) => {
    return calculerAge(dateNaissance);
  };

  // Fonction pour revenir à la liste
  const handleBackToList = () => {
    // Si on a été redirigé depuis une autre page (via URL avec ID)
    if (id) {
      navigate('/dashboard'); // Retour au tableau de bord médical
    } else {
      setViewMode('default');
      setSelectedPatient(null);
      setActiveTab('liste');
    }
  };

  // Fonction pour passer en mode édition
  const handleEditPatient = (patient) => {
    const patientToEdit = { ...patient };

    // Convertir les valeurs au format attendu par les inputs
    if (patientToEdit.poids) {
      patientToEdit.poids = patientToEdit.poids.replace(' kg', '');
    }

    if (patientToEdit.taille) {
      patientToEdit.taille = patientToEdit.taille.replace(' cm', '');
    }

    setPatientForm(patientToEdit);

    if (viewMode === 'detail') {
      setViewMode('edit');
    } else {
      setViewMode('edit');
      setSelectedPatient(patient);
    }
  };

  // Fonction pour annuler l'édition
  const handleCancelEdit = () => {
    if (selectedPatient) {
      setViewMode('detail');
    } else {
      setViewMode('default');
      setActiveTab('liste');
    }

    // Réinitialiser le formulaire
    setPatientForm({
      id: '',
      nom: '',
      dateNaissance: '',
      sexe: '',
      poids: '',
      taille: '',
      incubateur: '',
      parent: '',
      telephone: '',
      email: '',
      adresse: '',
      groupeSanguin: '',
      allergies: '',
      noteMedicale: '',
      antecedents: '',
      status: 'stable'
    });
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
  
    const updatedPatient = {
      ...selectedPatient,
      ...patientForm,
      poids: patientForm.poids + (patientForm.poids.includes('kg') ? '' : ' kg'),
      taille: patientForm.taille + (patientForm.taille.includes('cm') ? '' : ' cm')
    };
  
    // Envoi de la mise à jour au serveur (utilise PUT ou PATCH selon ton API)
    api.put(`patient/${updatedPatient.id}`, updatedPatient)
      .then(response => {
        // Mise à jour du patient dans le state
        const updatedPatients = patients.map(p =>
          p.id === updatedPatient.id ? updatedPatient : p
        );
        setPatients(updatedPatients);
        setSelectedPatient(updatedPatient);
        alert(`Patient ${updatedPatient.nom} modifié avec succès !`);
        setViewMode('detail');
      })
      .catch(err => {
        alert(err.message || "Erreur lors de la mise à jour du patient.");
      });
  };
  

  // Fonction pour soumettre le formulaire d'ajout
  const handleSubmitAdd = (e) => {
    e.preventDefault();

    // Formater la date au format JJ/MM/AAAA si c'est au format AAAA-MM-JJ
    let formattedDate = formaterDate(patientForm.dateNaissance);

    // Créer un nouveau patient
    const newPatient = {
      ...patientForm,
      dateNaissance: formattedDate,
      // Ajouter les unités
      poids: patientForm.poids + (patientForm.poids.includes('kg') ? '' : ' kg'),
      taille: patientForm.taille + (patientForm.taille.includes('cm') ? '' : ' cm'),
      // Ajouter des données par défaut pour les nouvelles entrées
      Traitements: [],
      ConstanteVitales: [
        {
          date: new Date().toLocaleDateString('fr-FR'),
          temperature: '37.0°C',
          pouls: '130 bpm',
          respiration: '40/min',
          poids: patientForm.poids + (patientForm.poids.includes('kg') ? '' : ' kg')
        }
      ]
    };
    // Supprimer l'ID s'il est présent
    delete newPatient.id;

    //Ajouter le nouveau patient à la bdd
    api.post('patient', newPatient)
      .then(response => {
        // Ajouter le nouveau patient à la liste
        setPatients([...patients, newPatient]);
        console.log(newPatient)
        // Simuler un ajout côté serveur
        alert(`Nouveau patient ${patientForm.nom} ajouté avec succès !`);
      })
      .catch(err => {
        alert(err.message || "Erreur lors du chargement des utilisateurs.");
      });

    // Réinitialiser le formulaire et retourner à la liste
    setPatientForm({
      id: '',
      nom: '',
      dateNaissance: '',
      sexe: '',
      poids: '',
      taille: '',
      incubateur: '',
      parent: '',
      telephone: '',
      email: '',
      adresse: '',
      groupeSanguin: '',
      allergies: '',
      noteMedicale: '',
      antecedents: '',
      status: 'stable'
    });

    setViewMode('default');
    setActiveTab('liste');
  };

  // Fonction pour mettre à jour le formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPatientForm({
      ...patientForm,
      [name]: value,
    });
  };

  // Fonction pour réinitialiser le formulaire d'ajout et passer en mode ajout
  const handleAddNewPatient = () => {
    setPatientForm({
      id: `P00${patients.length + 1}`, // Générer un ID basé sur le nombre actuel de patients
      nom: '',
      dateNaissance: '',
      sexe: '',
      poids: '',
      taille: '',
      incubateur: '',
      parent: '',
      telephone: '',
      email: '',
      adresse: '',
      groupeSanguin: '',
      allergies: '',
      noteMedicale: '',
      antecedents: '',
      status: 'stable'
    });
    setActiveTab('ajouter');
  };

  // Rendu de la vue détaillée du dossier patient
  const renderPatientDetails = () => {
    if (!selectedPatient) return null;

    return (
      <div className="patient-details"> 
        <div className="patient-actions-bar">
          <div className="patient-actions-left">
            <button className="btn btn-outline" onClick={handleBackToList}>
              <i className="fas fa-arrow-left"></i> {id ? 'Retour au tableau de bord' : 'Retour à la liste'}
            </button>
          </div>
          <div className="patient-actions-right">
            <button className="btn btn-outline">
              <i className="fas fa-print"></i> Imprimer
            </button>
            <button className="btn btn-primary" onClick={() => handleEditPatient(selectedPatient)}>
              <i className="fas fa-edit"></i> Modifier
            </button>
          </div>
        </div>

        <div className="card-header detail-header">
          <h3>
            <span className={`status-badge status-${selectedPatient.status}`}>
              <i className={`fas ${selectedPatient.status === 'stable' ? 'fa-check-circle' :
                  selectedPatient.status === 'warning' ? 'fa-exclamation-triangle' :
                    'fa-exclamation-circle'
                }`}></i>
            </span>
            Dossier médical - {selectedPatient.nom}
          </h3>
        </div>

        <div className="patient-info-grid">
          <div className="patient-info-section">
            <h4>Informations personnelles</h4>
            <div className="info-grid">
              <div className="info-item">
                <label>ID Patient:</label>
                <span>{selectedPatient.id}</span>
              </div>
              <div className="info-item">
                <label>Nom complet:</label>
                <span>{selectedPatient.nom}</span>
              </div>
              <div className="info-item">
                <label>Date de naissance:</label>
                <span>{selectedPatient.dateNaissance}</span>
              </div>
              <div className="info-item">
                <label>Âge:</label>
                <span>{getPatientAge(selectedPatient.dateNaissance)}</span>
              </div>
              <div className="info-item">
                <label>Sexe:</label>
                <span>{selectedPatient.sexe}</span>
              </div>
              <div className="info-item">
                <label>Poids:</label>
                <span>{selectedPatient.poids}</span>
              </div>
              <div className="info-item">
                <label>Taille:</label>
                <span>{selectedPatient.taille}</span>
              </div>
              <div className="info-item">
                <label>Groupe sanguin:</label>
                <span>{selectedPatient.groupeSanguin}</span>
              </div>
              <div className="info-item">
                <label>Allergies:</label>
                <span>{selectedPatient.allergies}</span>
              </div>
            </div>
          </div>

          <div className="patient-info-section">
            <h4>Informations de contact</h4>
            <div className="info-grid">
              <div className="info-item">
                <label>Parent(s):</label>
                <span>{selectedPatient.parent}</span>
              </div>
              <div className="info-item">
                <label>Téléphone:</label>
                <span>{selectedPatient.telephone}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{selectedPatient.email}</span>
              </div>
              <div className="info-item">
                <label>Adresse:</label>
                <span>{selectedPatient.adresse}</span>
              </div>
            </div>
          </div>

          <div className="patient-info-section full-width">
            <h4>Informations médicales</h4>
            <div className="info-grid">
              <div className="info-item">
                <label>Incubateur:</label>
                <span>
                  <span className="incubator-badge">
                    <i className="fas fa-baby-carriage"></i> {selectedPatient.incubateur}
                  </span>
                </span>
              </div>
              <div className="info-item full-width">
                <label>Notes médicales:</label>
                <p>{selectedPatient.noteMedicale}</p>
              </div>
              <div className="info-item full-width">
                <label>Antécédents:</label>
                <p>{selectedPatient.antecedents}</p>
              </div>
            </div>
          </div>

          <div className="patient-info-section full-width">
            <h4>Traitement en cours</h4>
            {selectedPatient.Traitements && selectedPatient.Traitements.length > 0 ? (
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Médicament</th>
                    <th>Dosage</th>
                    <th>Fréquence</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPatient.Traitements.map((traitement, index) => (
                    <tr key={index}>
                      <td>{traitement.medicament}</td>
                      <td>{traitement.dosage}</td>
                      <td>{traitement.frequence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data-message">Aucun traitement en cours</p>
            )}
          </div>

          <div className="patient-info-section full-width">
            <h4>Constantes vitales récentes</h4>
            {selectedPatient.ConstanteVitales && selectedPatient.ConstanteVitales.length > 0 ? (
              <table className="detail-table">
                <thead>
                  <tr>
                  <th>Date</th>
                   <th>Température</th>
                   <th>Pouls</th>
                   <th>Respiration</th>
                   <th>Humidité corporelle</th>
                    <th>Poids</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPatient.ConstanteVitales.map((constante, index) => (
                    <tr key={index}>
                      <td>{constante.date}</td>
                       <td>{constante.temperature}</td>
                      <td>   {constante.pouls}</td>
                      <td>   {constante.respiration}</td>
                      <td>   {constante.humiditeCorp}</td>
                      <td>   {constante.poids}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data-message">Aucune donnée de constantes vitales disponible</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Rendu du formulaire d'édition du patient
  const renderEditForm = () => {
    return (
      <div className="patient-edit-form">
        <div className="card-header detail-header">
          <button className="btn btn-outline" onClick={handleCancelEdit}>
            <i className="fas fa-arrow-left"></i> Annuler
          </button>
          <h3>
            {selectedPatient ? `Modifier le patient - ${selectedPatient.nom}` : 'Nouveau patient'}
          </h3>
          <div></div> {/* Espace vide pour maintenir l'alignement */}
        </div>

        <form onSubmit={selectedPatient ? handleSubmitEdit : handleSubmitAdd}>
          <div className="form-sections">
            <div className="form-section">
              <h4 className="form-section-title">Informations personnelles</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="id">ID Patient</label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={patientForm.id}
                    onChange={handleFormChange}
                    disabled={selectedPatient} // Ne pas permettre de modifier l'ID pour un patient existant
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nom">Nom et prénom</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={patientForm.nom}
                    onChange={handleFormChange}
                    placeholder="Nom et prénom du bébé"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dateNaissance">Date de naissance</label>
                  <input
                    type="date"
                    id="dateNaissance"
                    name="dateNaissance"
                    value={patientForm.dateNaissance}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sexe">Sexe</label>
                  <select
                    id="sexe"
                    name="sexe"
                    value={patientForm.sexe}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="poids">Poids (kg)</label>
                  <input
                    type="number"
                    id="poids"
                    name="poids"
                    value={patientForm.poids}
                    onChange={handleFormChange}
                    step="0.1"
                    placeholder="Poids en kg"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="taille">Taille (cm)</label>
                  <input
                    type="number"
                    id="taille"
                    name="taille"
                    value={patientForm.taille}
                    onChange={handleFormChange}
                    placeholder="Taille en cm"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="groupeSanguin">Groupe sanguin</label>
                  <select
                    id="groupeSanguin"
                    name="groupeSanguin"
                    value={patientForm.groupeSanguin}
                    onChange={handleFormChange}
                  >
                    <option value="">Sélectionner</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="allergies">Allergies</label>
                  <input
                    type="text"
                    id="allergies"
                    name="allergies"
                    value={patientForm.allergies}
                    onChange={handleFormChange}
                    placeholder="Allergies connues"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-section-title">Informations de contact</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="parent">Nom des parents</label>
                  <input
                    type="text"
                    id="parent"
                    name="parent"
                    value={patientForm.parent}
                    onChange={handleFormChange}
                    placeholder="Nom et prénom des parents"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telephone">Téléphone</label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={patientForm.telephone}
                    onChange={handleFormChange}
                    placeholder="Numéro de téléphone"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={patientForm.email}
                    onChange={handleFormChange}
                    placeholder="Adresse email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="adresse">Adresse</label>
                  <input
                    type="text"
                    id="adresse"
                    name="adresse"
                    value={patientForm.adresse}
                    onChange={handleFormChange}
                    placeholder="Adresse de résidence"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-section-title">Informations médicales</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="incubateur">Incubateur</label>
                  <select
                    id="incubateur"
                    name="incubateur"
                    value={patientForm.incubateur}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Sélectionner un incubateur</option>
                    <option value="1">Incubateur A1</option>
                    <option value="2">Incubateur B2</option>
                    <option value="3">Incubateur C3</option>
                    <option value="4">Incubateur A4</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Statut</label>
                  <select
                    id="status"
                    name="status"
                    value={patientForm.status}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Sélectionner un statut</option>
                    <option value="stable">Stable</option>
                    <option value="warning">Attention requise</option>
                    <option value="critical">Critique</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="noteMedicale">Notes médicales</label>
                  <textarea
                    id="noteMedicale"
                    name="noteMedicale"
                    value={patientForm.noteMedicale}
                    onChange={handleFormChange}
                    placeholder="Notes médicales importantes"
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="antecedents">Antécédents</label>
                  <textarea
                    id="antecedents"
                    name="antecedents"
                    value={patientForm.antecedents}
                    onChange={handleFormChange}
                    placeholder="Antécédents médicaux et familiaux"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={handleCancelEdit}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedPatient ? 'Enregistrer les modifications' : 'Ajouter le patient'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="main-content" id="main-content">
      <div className="topbar">
        <h1 className="page-title">Gestion des patients</h1>
      </div>
      <div className="dashboard-content">
        <div className="card">
          {viewMode === 'default' ? (
            <>
              <div className="card-header">
                <div className="tabs">
                  <button
                    className={`tab-btn ${activeTab === 'liste' ? 'active' : ''}`}
                    onClick={() => setActiveTab('liste')}
                  >
                    <i className="fas fa-list"></i> Liste des patients
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'ajouter' ? 'active' : ''}`}
                    onClick={handleAddNewPatient}
                  >
                    <i className="fas fa-plus"></i> Ajouter un patient
                  </button>
                </div>
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Rechercher un patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="search-btn">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
              <div className="card-body">
                {activeTab === 'liste' ? (
                  <div className="patients-table-container">
                    <table className="patients-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nom</th>
                          <th>Date de naissance</th>
                          <th>Âge</th>
                          <th>Sexe</th>
                          <th>Poids/Taille</th>
                          <th>Incubateur</th>
                          <th>Statut</th>
                          <th>Parent(s)</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPatients.map((patient, index) => (
                          <tr key={index} className={`status-${patient.status}`}>
                            <td>P00{patient.id}</td>
                            <td><strong>{patient.nom}</strong></td>
                            <td>{patient.dateNaissance}</td>
                            <td>{getPatientAge(patient.dateNaissance)}</td>
                            <td>{patient.sexe}</td>
                            <td>{patient.poids} / {patient.taille}</td>
                            <td>
                              <span className="incubator-badge">
                                <i className="fas fa-baby-carriage"></i> {patient.incubateur}
                              </span>
                            </td>
                            <td>
                              <span className={`status-badge status-${patient.status}`}>
                                <i className={`fas ${patient.status === 'stable' ? 'fa-check-circle' :
                                    patient.status === 'warning' ? 'fa-exclamation-triangle' :
                                      'fa-exclamation-circle'
                                  }`}></i>
                                {patient.status === 'stable' ? 'Stable' :
                                  patient.status === 'warning' ? 'Attention' : 'Critique'}
                              </span>
                            </td>
                            <td>{patient.parent}</td>
                            <td>
                              <div className="row-actions">
                                <button
                                  className="action-btn view-btn small"
                                  title="Voir le dossier"
                                  onClick={() => handleViewPatientDetails(patient)}
                                >
                                  <i className="fas fa-folder-open"></i>
                                </button>
                                <button className="action-btn history-btn small" title="Historique">
                                  <i className="fas fa-history"></i>
                                </button>
                                <button
                                  className="action-btn alert-btn small"
                                  title="Éditer"
                                  onClick={() => handleEditPatient(patient)}
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredPatients.length === 0 && (
                      <div className="no-results">
                        <i className="fas fa-search"></i>
                        <p>Aucun patient ne correspond à votre recherche.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  renderEditForm() // Utiliser le même formulaire pour l'ajout
                )}
              </div>
            </>
          ) : viewMode === 'detail' ? (
            renderPatientDetails()
          ) : (
            renderEditForm()
          )}
        </div>
      </div>
    </div>
  );
}

export default Patient; 