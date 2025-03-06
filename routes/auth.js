const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/login', async (req, res) => {
    console.log('Tentative de connexion:', req.body);
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log('Utilisateur trouvé:', user);

        if (!user) {
            console.log('Utilisateur non trouvé');
            req.flash('error', 'Email ou mot de passe incorrect');
            return res.redirect('/');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Mot de passe valide:', validPassword);

        if (!validPassword) {
            console.log('Mot de passe incorrect');
            req.flash('error', 'Email ou mot de passe incorrect');
            return res.redirect('/');
        }

        // Stocker l'utilisateur dans la session
        req.session.user = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        };
        console.log('Session utilisateur créée:', req.session.user);

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Erreur de connexion:', error);
        req.flash('error', 'Erreur lors de la connexion');
        res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router; 