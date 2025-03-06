// Importation des dépendances nécessaires
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Importation des fichiers de routes
const catwaysRoutes = require('./routes/catways'); // Routes pour les catways
const reservationsRoutes = require('./routes/reservations'); // Routes pour les réservations
const usersRoutes = require('./routes/users'); // Routes pour les utilisateurs
const authRoutes = require('./routes/auth');
const viewRoutes = require('./routes/viewRoutes');

const app = express();
const PORT = process.env.PORT || 5050;

// Middlewares - Ordre important !
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuration des sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Configuration de Flash
app.use(flash());

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Définition des routes
app.use('/api/catways', catwaysRoutes);     // Route catways
app.use('/api', reservationsRoutes);     // Enlever le préfixe /reservations car il est dans les routes
app.use('/api/users', usersRoutes);         // Route users
app.use('/api', authRoutes);
app.use('/', viewRoutes);

// Options personnalisées pour Swagger UI
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none } .custom-button { background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 10px; display: inline-block; }',
  customSiteTitle: "API Port Manager",
  customfavIcon: "/assets/favicon.ico",
  customJs: '/custom.js'
};

// Ajouter le middleware pour le bouton de retour
app.use('/api-docs', (req, res, next) => {
  const customHTML = `
    <div style="padding: 20px; background: #f8f9fa;">
      <a href="/dashboard" class="custom-button">Retour au Tableau de Bord</a>
    </div>
  `;
  res.send = ((send) => (body) => {
    if (typeof body === 'string') {
      body = body.replace('<body>', '<body>' + customHTML);
    }
    send.call(res, body);
  })(res.send);
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerOptions));

// Configuration et connexion à la base de données MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  // Message de succès si la connexion est établie
  console.log("✅ Connecté à MongoDB !");
}).catch(err => {
  // Message d'erreur si la connexion échoue
  console.error("❌ Erreur de connexion à MongoDB :", err);
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
