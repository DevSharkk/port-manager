const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/login', async (req, res) => {
    try {
        console.log('Tentative de connexion:', req.body);
        
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email et mot de passe requis'
            });
        }
        
        const user = await User.findOne({ email });
        console.log('Utilisateur trouvé:', user);
        
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Email ou mot de passe incorrect'
            });
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        console.log('Mot de passe valide:', isValid);
        
        if (!isValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Email ou mot de passe incorrect'
            });
        }
        
        // Créer la session
        req.session.user = {
            id: user._id,
            email: user.email,
            username: user.username || 'Admin',
            role: user.role || 'admin'
        };
        
        console.log('Session utilisateur créée:', req.session.user);
        
        // Répondre avec un JSON au lieu de rediriger
        return res.status(200).json({
            status: 'success',
            message: 'Connexion réussie',
            redirect: '/dashboard'
        });
        
    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la connexion'
        });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router; 