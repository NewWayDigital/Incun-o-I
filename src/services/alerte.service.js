import axios from 'axios';
import { API_URL } from '../config/config';

/**
 * Récupère toutes les alertes
 * @returns {Promise<Array>} - Liste des alertes
 */
const getAllAlertes = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/alerte`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error);
    throw error;
  }
};

/**
 * Récupère une alerte par ID
 * @param {string} id - ID de l'alerte à récupérer
 * @returns {Promise<Object>} - L'alerte récupérée
 */
const getAlerteById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/alerte/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'alerte:', error);
    throw error;
  }
};

/**
 * Crée une nouvelle alerte
 * @param {object} alerteData - Données de l'alerte à créer
 * @returns {Promise<Object>} - L'alerte créée
 */
const createAlerte = async (alerteData) => {
  try {
    const response = await axios.post(`${API_URL}/api/alerte`, alerteData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'alerte:', error);
    throw error;
  }
};

/**
 * Met à jour une alerte
 * @param {string} id - ID de l'alerte à mettre à jour
 * @param {object} alerteData - Données de l'alerte à mettre à jour
 * @returns {Promise<Object>} - L'alerte mise à jour
 */
const updateAlerte = async (id, alerteData) => {
  try {
    const response = await axios.put(`${API_URL}/api/alerte/${id}`, alerteData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'alerte:', error);
    throw error;
  }
};

/**
 * Supprime une alerte
 * @param {string} id - ID de l'alerte à supprimer
 * @returns {Promise<Object>} - Message de confirmation
 */
const deleteAlerte = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/alerte/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'alerte:', error);
    throw error;
  }
};

export default {
  getAllAlertes,
  getAlerteById,
  createAlerte,
  updateAlerte,
  deleteAlerte
}; 