const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

// Page d'accueil (login)
router.get('/', (req, res) => {
    res.render('index', {
        error: req.flash('error'),
        success: req.flash('success')
    });
});

// Dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        // Récupérer toutes les réservations
        const reservations = await Reservation.find();
        console.log('Réservations trouvées:', reservations); // Pour déboguer

        res.render('dashboard', {
            user: req.session.user,
            reservations: reservations
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.redirect('/');
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
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.render('users/index', { users });
    } catch (error) {
        res.redirect('/dashboard');
    }
});

router.get('/users/create', isAdmin, (req, res) => {
    res.render('users/create');
});

module.exports = router; 