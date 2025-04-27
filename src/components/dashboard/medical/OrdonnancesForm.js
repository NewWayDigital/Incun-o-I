import React, { useState, useEffect } from 'react';
import { patientService } from '../../../services/api';
import '../../../styles/dashboard/OrdonnanceForm.css';

function OrdonnancesForm({ ordonnance, onSave, onCancel, selectedPatientId }) {
  // Valeurs par défaut pour une nouvelle ordonnance
  const defaultValues = {
    patient: '',
    patientId: selectedPatientId || '',
    medecin: '',
    medicaments: [{ nom: '', posologie: '', duree: '' }],
    notes: '',
    statut: 'active'
  };

  // État du formulaire
  const [formData, setFormData] = useState(ordonnance || defaultValues);
  const [errors, setErrors] = useState({});
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  console.log("FormData actuel:", formData); // Pour débogage

  // Charger la liste des patients pour le sélecteur
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoadingPatients(true);
        const response = await patientService.getAll();
        console.log("Réponse API patients:", response); // Log de tous les patients
        setPatients(response || []);

        // Si on est en mode création et qu'un patient est sélectionné, préremplir les infos du patient
        if (!ordonnance && selectedPatientId && response) {
          const selectedPatient = response.find(p => p.id.toString() === selectedPatientId.toString());
          console.log("Patient sélectionné:", selectedPatient); // Log du patient sélectionné
          
          if (selectedPatient) {
            // On utilise le nom du patient directement puisque le modèle n'a qu'un champ 'nom'
            const patientNom = selectedPatient.nom || 'Patient inconnu';
            
            setFormData(prevData => ({
              ...prevData,
              patientId: selectedPatient.id,
              patient: patientNom
            }));
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement des patients:', err);
        setPatients([]);
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [ordonnance, selectedPatientId]);

  // Gérer les changements des champs de base
  const handleInputChange = (e) => {
    console.log("Input changé:", e.target.name, e.target.value); // Pour débogage
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Gérer le changement de patient sélectionné
  const handlePatientSelect = (e) => {
    const patientId = e.target.value;
    if (patientId === "") {
      setFormData(prevData => ({
        ...prevData,
        patientId: "",
        patient: ""
      }));
      return;
    }
    
    const selectedPatient = patients.find(p => p.id.toString() === patientId.toString());
    console.log("Patient sélectionné dans handlePatientSelect:", selectedPatient); // Log du patient sélectionné
    
    if (selectedPatient) {
      // On utilise le nom du patient directement puisque le modèle n'a qu'un champ 'nom'
      const patientNom = selectedPatient.nom || 'Patient inconnu';
      
      setFormData(prevData => ({
        ...prevData,
        patientId: selectedPatient.id,
        patient: patientNom
      }));
    }
  };

  // Gérer les changements des champs de médicament
  const handleMedicamentChange = (index, field, value) => {
    console.log("Médicament changé:", index, field, value); // Pour débogage
    const updatedMedicaments = [...formData.medicaments];
    updatedMedicaments[index] = {
      ...updatedMedicaments[index],
      [field]: value
    };

    setFormData(prevData => ({
      ...prevData,
      medicaments: updatedMedicaments
    }));
  };

  // Ajouter un nouveau médicament vide
  const handleAddMedicament = () => {
    setFormData(prevData => ({
      ...prevData,
      medicaments: [
        ...prevData.medicaments,
        { nom: '', posologie: '', duree: '' }
      ]
    }));
  };

  // Supprimer un médicament de la liste
  const handleRemoveMedicament = (index) => {
    if (formData.medicaments.length <= 1) return; // Garder au moins un médicament
    
    const updatedMedicaments = [...formData.medicaments];
    updatedMedicaments.splice(index, 1);
    
    setFormData(prevData => ({
      ...prevData,
      medicaments: updatedMedicaments
    }));
  };

  // Valider le formulaire avant soumission
  const validateForm = () => {
    const newErrors = {};
    
    // Valider les champs obligatoires
    if (!formData.patient.trim() && !formData.patientId) {
      newErrors.patient = 'Le patient est requis';
    }
    
    if (!formData.medecin.trim()) {
      newErrors.medecin = 'Le nom du médecin est requis';
    }
    
    // Valider les médicaments
    formData.medicaments.forEach((med, index) => {
      if (!med.nom.trim()) {
        newErrors[`medicament_${index}_nom`] = 'Le nom du médicament est requis';
      }
      if (!med.posologie.trim()) {
        newErrors[`medicament_${index}_posologie`] = 'La posologie est requise';
      }
      if (!med.duree.trim()) {
        newErrors[`medicament_${index}_duree`] = 'La durée est requise';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis avec données:", formData); // Pour débogage
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="form-header">
          <button 
            type="button"
            onClick={onCancel}
            className="back-button"
          >
            <i className="fas fa-arrow-left"></i> Retour
          </button>
          <h2>
            {ordonnance ? 'Modifier ordonnance' : 'Nouvelle ordonnance'}
          </h2>
        </div>

        {/* Patient Information */}
        <div className="form-section">
          <h3>Informations du patient</h3>
          
          <div className="form-row">
            <div className="form-field">
              <label>Sélectionner un patient *</label>
              <select
                value={formData.patientId || ""}
                onChange={handlePatientSelect}
                disabled={loadingPatients || !!ordonnance}
              >
                <option value="">-- Sélectionner un patient --</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.prenom} {patient.nom}
                  </option>
                ))}
              </select>
              {loadingPatients && <p className="help-text">Chargement des patients...</p>}
              {errors.patient && <p className="error-text">{errors.patient}</p>}
            </div>
            
            <div className="form-field">
              <label>Nom du patient (non modifiable)</label>
              <input
                type="text"
                value={formData.patient || ''}
                readOnly
                placeholder="Sélectionnez un patient dans la liste"
              />
            </div>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="form-section">
          <h3>Informations du médecin</h3>
          
          <div className="form-field">
            <label>Nom du médecin *</label>
            <input
              type="text"
              name="medecin"
              value={formData.medecin}
              onChange={handleInputChange}
              placeholder="Ex: Dr. Koffi ASSOGBA"
            />
            {errors.medecin && <p className="error-text">{errors.medecin}</p>}
          </div>
        </div>

        {/* Medications */}
        <div className="form-section">
          <div className="section-header">
            <h3>Médicaments</h3>
            <button
              type="button"
              onClick={handleAddMedicament}
              className="add-button"
            >
              <i className="fas fa-plus"></i> Ajouter un médicament
            </button>
          </div>
          
          {formData.medicaments.map((med, index) => (
            <div key={index} className="medication-card">
              <div className="medication-header">
                <h4>Médicament {index + 1}</h4>
                {formData.medicaments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicament(index)}
                    className="delete-button"
                  >
                    <i className="fas fa-trash"></i> Supprimer
                  </button>
                )}
              </div>
              
              <div className="medication-fields">
                <div className="form-field">
                  <label>Nom du médicament *</label>
                  <input
                    type="text"
                    value={med.nom}
                    onChange={(e) => handleMedicamentChange(index, 'nom', e.target.value)}
                    placeholder="Ex: Paracétamol 500mg"
                  />
                  {errors[`medicament_${index}_nom`] && 
                    <p className="error-text">{errors[`medicament_${index}_nom`]}</p>
                  }
                </div>
              
                <div className="medication-details">
                  <div className="form-field">
                    <label>Posologie *</label>
                    <input
                      type="text"
                      value={med.posologie}
                      onChange={(e) => handleMedicamentChange(index, 'posologie', e.target.value)}
                      placeholder="Ex: 1 comprimé toutes les 6 heures"
                    />
                    {errors[`medicament_${index}_posologie`] && 
                      <p className="error-text">{errors[`medicament_${index}_posologie`]}</p>
                    }
                  </div>
                  <div className="form-field">
                    <label>Durée *</label>
                    <input
                      type="text"
                      value={med.duree}
                      onChange={(e) => handleMedicamentChange(index, 'duree', e.target.value)}
                      placeholder="Ex: 5 jours"
                    />
                    {errors[`medicament_${index}_duree`] && 
                      <p className="error-text">{errors[`medicament_${index}_duree`]}</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="form-section">
          <h3>Notes additionnelles</h3>
          
          <div className="form-field">
            <label>Notes et instructions</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              placeholder="Instructions particulières pour le patient..."
            ></textarea>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="submit-button"
          >
            <i className="fas fa-save"></i> Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrdonnancesForm; 