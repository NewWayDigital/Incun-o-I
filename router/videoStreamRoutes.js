const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const axios = require('axios');

// Création du serveur WebSocket
const wss = new WebSocket.Server({ noServer: true });

// Stockage des connexions WebSocket actives
const clients = new Set();

// Configuration de l'ESP32-CAM
const ESP32_CAM_URL = 'http://192.168.1.100'; // Remplacez par l'adresse IP de votre ESP32-CAM

// Gestion des connexions WebSocket
wss.on('connection', (ws) => {
    console.log('Nouvelle connexion WebSocket établie');
    clients.add(ws);

    ws.on('close', () => {
        console.log('Connexion WebSocket fermée');
        clients.delete(ws);
    });
});

// Route pour démarrer le streaming
router.get('/stream', async (req, res) => {
    try {
        // Vérifier si l'ESP32-CAM est accessible
        const response = await axios.get(`${ESP32_CAM_URL}/status`);
        if (response.status === 200) {
            res.json({ message: 'Streaming démarré avec succès' });
        } else {
            res.status(500).json({ error: 'Impossible de se connecter à l\'ESP32-CAM' });
        }
    } catch (error) {
        console.error('Erreur lors de la connexion à l\'ESP32-CAM:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion à l\'ESP32-CAM' });
    }
});

// Fonction pour diffuser les images aux clients connectés
async function broadcastImage(imageData) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(imageData);
        }
    });
}

// Fonction pour récupérer et diffuser les images de l'ESP32-CAM
async function streamFromESP32() {
    try {
        const response = await axios.get(`${ESP32_CAM_URL}/capture`, {
            responseType: 'arraybuffer'
        });
        
        const imageData = Buffer.from(response.data).toString('base64');
        broadcastImage(imageData);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'image:', error);
    }
}

// Démarrer le streaming toutes les 100ms
setInterval(streamFromESP32, 100);

module.exports = { router, wss }; 