const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

// Middleware d'authentification
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
};

// Routes pour les utilisateurs (AVANT les autres routes)
router.get('/users', isAuthenticated, async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.render('users/index', { 
            users,
            currentUser: req.session.user
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.redirect('/users');
    }
});

router.get('/users/create', isAuthenticated, (req, res) => {
    res.render('users/create', { 
        currentUser: req.session.user
    });
});

router.get('/users/:email/edit', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }, { password: 0 });
        if (!user) {
            return res.redirect('/users');
        }
        res.render('users/edit', { 
            user,
            currentUser: req.session.user
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.redirect('/users');
    }
});

// Route d'accueil
router.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    
    const error = req.query.error;
    res.render('index', { error });
});

/**
 * Tableau de bord de l'utilisateur connecté
 * @route GET /dashboard
 * @returns {View} Tableau de bord avec toutes les réservations
 * @security Session
 */
router.get('/dashboard', async (req, res) => {
    try {
        console.log('Accès au dashboard, session:', req.session);
        console.log('Utilisateur en session:', req.session.user);
        
        if (!req.session.user) {
            console.log('Pas d\'utilisateur en session, redirection vers /');
            return res.redirect('/');
        }
        
        // Récupérer toutes les réservations sans filtre de date
        const reservations = await Reservation.find()
            .sort({ startDate: -1 }); // Tri par date de début décroissante (les plus récentes d'abord)
        
        console.log('Nombre total de réservations trouvées:', reservations.length);
        
        const today = new Date();
        
        res.render('dashboard', { 
            currentUser: req.session.user,
            reservations: reservations,
            today: today
        });
    } catch (error) {
        console.error('Erreur dashboard:', error);
        res.status(500).send('Erreur serveur. Veuillez réessayer plus tard.');
    }
});

// Routes Catways
router.get('/catways', isAuthenticated, async (req, res) => {
    try {
        const catways = await Catway.find();
        res.render('catways/index', { catways });
    } catch (error) {
        res.redirect('/dashboard');
    }
});

router.get('/catways/create', isAuthenticated, (req, res) => {
    res.render('catways/create');
});

// Route pour afficher le formulaire d'édition d'un catway
router.get('/catways/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res.redirect('/catways');
        }
        res.render('catways/edit', { catway });
    } catch (error) {
        console.error('Erreur:', error);
        res.redirect('/catways');
    }
});

// Routes Réservations
router.get('/reservations', isAuthenticated, async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.render('reservations/index', { reservations });
    } catch (error) {
        res.redirect('/dashboard');
    }
});

router.get('/reservations/create', isAuthenticated, async (req, res) => {
    try {
        const catways = await Catway.find({ catwayState: 'disponible' });
        res.render('reservations/create', { catways });
    } catch (error) {
        res.redirect('/reservations');
    }
});

// Route pour afficher les détails d'une réservation
router.get('/reservations/:id', isAuthenticated, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.redirect('/dashboard');
        }
        res.render('reservations/detail', { 
            reservation: reservation,
            user: req.session.user
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.redirect('/dashboard');
    }
});

// Routes Utilisateurs (admin seulement)
router.get('/users', isAuthenticated, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.render('users/index', { users });
    } catch (error) {
        res.redirect('/dashboard');
    }
});

router.get('/users/create', isAuthenticated, (req, res) => {
    res.render('users/create');
});

// Route pour afficher le formulaire de création
router.get('/users/create', (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/');
        }
        res.render('users/create', { 
            currentUser: req.session.user
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.redirect('/users');
    }
});

// Route pour afficher le formulaire de modification
router.get('/users/:email/edit', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/');
        }
        const user = await User.findOne({ email: req.params.email }, { password: 0 });
        if (!user) {
            return res.redirect('/users');
        }
        res.render('users/edit', { 
            user,
            currentUser: req.session.user
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.redirect('/users');
    }
});

module.exports = router; 