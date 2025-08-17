// Charger les variables d'environnement locales pour les tests
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './config/local.env' })
}

const express = require('express')
const app = express()
const ENV = require('./config')
const { db } = require('./models')
const cors = require('cors')
const http = require('http')
const path = require('path')

//IMPORTATION DES ROUTES
const userRouter = require('./router/user.router')
const patientRouter = require('./router/patient.router')
const traitementRouter = require('./router/traitement.router')
const constanteRouter = require('./router/constance.router')
const incubateurRouter = require('./router/incubateur.router')
const alerteRouter = require('./router/alerte.router')
const incubateurTrendRouter = require('./router/incubateurTrend.router')
const photoRouter = require('./router/photoRoutes')
const videoRouter = require('./router/videoRoutes')
const { router: videoStreamRouter, wss } = require('./router/videoStreamRoutes')

//PORT - Utiliser le port de Railway ou 3000 par défaut
const PORT = process.env.PORT || ENV.PORT || 3000

//MIDDLEWARES
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Configuration CORS pour la production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://incuneoi.vercel.app',
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// Middleware de sécurité
app.use((req, res, next) => {
  // Headers de sécurité
  res.header('X-Content-Type-Options', 'nosniff')
  res.header('X-Frame-Options', 'DENY')
  res.header('X-XSS-Protection', '1; mode=block')
  
  // Log des requêtes en production
  if (process.env.NODE_ENV === 'production') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  }
  
  next()
})

//PREFIX DES ROUTES
app.use('/api/user', userRouter)
app.use('/api/patient', patientRouter)
app.use('/api/traitement', traitementRouter)
app.use('/api/constance', constanteRouter)
app.use('/api/incubateur', incubateurRouter)
app.use('/api/alerte', alerteRouter)
app.use('/api/incubateur', incubateurTrendRouter)
app.use('/api/photos', photoRouter)
app.use('/api/videos', videoRouter)
app.use('/api/video-stream', videoStreamRouter)

// Route de santé pour Railway
app.get('/health', async (req, res) => {
  try {
    // Vérifier la connexion à la base de données
    await db.authenticate()
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      port: PORT
    })
  } catch (error) {
    console.error('Healthcheck failed:', error.message)
    res.status(503).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      error: error.message
    })
  }
})

// Route racine
app.get('/', (req, res) => {
  res.json({ 
    message: 'IncuNeo API Backend',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development'
  })
})

//GESTION d'erreur
app.use((req, res) => {
    res.status(404).json({ message: "La ressource demandée n'est pas disponible ou l'URL est invalide" });
});

//MIDDLEWARES DE GESTION D'ERREUR
app.use((err, req, res, next) => {
    console.error("ERREUR DÉTAILLÉE:", err);
    
    const status = err.status || 500
    const message = err.message || "une erreur est survenue."
    const details = process.env.NODE_ENV === 'production' ? null : err.details

    res.status(status).json({
      error: {
        status,
        message,
        details,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
      }
    })
})

//SERVEUR
const server = http.createServer(app);

// Configuration du WebSocket
server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

  if (pathname === '/api/video-stream/stream') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

const startServer = async() => {
    try {
        console.log('🔧 Configuration de démarrage:', {
            PORT: PORT,
            NODE_ENV: process.env.NODE_ENV,
            MYSQLHOST: process.env.MYSQLHOST,
            MYSQLPORT: process.env.MYSQLPORT,
            MYSQL_DATABASE: process.env.MYSQL_DATABASE,
            MYSQLUSER: process.env.MYSQLUSER
        })
        
        // Test de connexion à la base de données
        await db.authenticate()
        console.log('✅ Connexion à la base de données Railway réussie !')
        
        // Synchronisation des modèles (sans forcer la recréation)
        await db.sync({ force: false, alter: false })
        console.log('✅ Base de données synchronisée avec succès !')

        server.listen(PORT, () => {
            console.log(`🚀 Serveur IncuNeo démarré avec succès !`)
            console.log(`📊 Port: ${PORT}`)
            console.log(`🌐 Environnement: ${process.env.NODE_ENV || 'development'}`)
            console.log(`🗄️ Base de données: ${process.env.MYSQL_DATABASE || process.env.DATABASE || 'railway'}`)
            console.log(`🔗 URL: http://localhost:${PORT}`)
            console.log(`🏥 Healthcheck: http://localhost:${PORT}/health`)
        })
    } catch (error) {
        console.error('❌ Erreur au démarrage du serveur:', error.message)
        console.error('🔧 Détails de l\'erreur:', error)
        process.exit(1)
    }
}

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('🛑 Signal SIGTERM reçu, arrêt du serveur...')
  server.close(() => {
    console.log('✅ Serveur arrêté proprement')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('🛑 Signal SIGINT reçu, arrêt du serveur...')
  server.close(() => {
    console.log('✅ Serveur arrêté proprement')
    process.exit(0)
  })
})

startServer() 