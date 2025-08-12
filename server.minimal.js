const express = require('express')
const app= express()
const ENV=require('./config')
const { db } = require('./models')
const cors=require('cors')
//IMPORTATION DES ROUTES
const userRouter=require('./router/user.router')
const patientRouter=require('./router/patient.router')
const traitementRouter=require('./router/traitement.router')
const constanteRouter=require('./router/constance.router')
const incubateurRouter=require('./router/incubateur.router')
const alerteRouter=require('./router/alerte.router')
const incubateurTrendRouter=require('./router/incubateurTrend.router')
const photoRouter=require('./router/photoRoutes')
const videoRouter=require('./router/videoRoutes')
//PORT

PORT= ENV.PORT || 8080

//MIDDLEWARES
app.use(express.json())

// Middleware pour gérer les CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Gérer les requêtes OPTIONS
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

//PREFIX
app.use('/api/user', userRouter)
app.use('/api/patient', patientRouter)
app.use('/api/traitement', traitementRouter)
app.use('/api/constance', constanteRouter)
app.use('/api/incubateur',incubateurRouter)
app.use('/api/alerte', alerteRouter)
app.use('/api/incubateur', incubateurTrendRouter)
app.use('/api/photos', photoRouter)
app.use('/api/videos', videoRouter)

//GESTION d'erreur
app.use((req, res) => {
    res.status(404).json({ message: "La ressource demandée n'est pas disponible ou l'URL est invalide" });
});

//MIDDLEWARES DE GESTION D'ERREUR
app.use((err,req,res,next) =>{
    console.error("ERREUR DÉTAILLÉE:", err);
    console.error("Stack trace:", err.stack);
    
    const status = err.status || 500
    const message = err.message || "une erreur est survenue."
    const details = err.details || null;

    res.status(status).json({error:{
        status,
        message,
        details,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    }})
})

//SERVEUR

const startsServeur = async() =>{
    try {
        await db.sync({force: false})
        console.log(`✅✅✅Database syncing succesfully: `)

        app.listen(PORT,()=>{
            console.log(`✅✅✅ Server running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error(`❌❌❌Error syncing database: `,error.message) 
    }
}
startsServeur();