const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/login', async (req, res) => {
    try {
        console.log('Tentative de connexion:', req.body);
        
        const { email, password } = req.body;
        
        if (!email || !password) {
            console.log('Champs manquants');
            return res.redirect('/?error=Veuillez remplir tous les champs');
        }
        
        const user = await User.findOne({ email });
        console.log('Utilisateur trouvé:', user);
        
        if (!user) {
            console.log('Utilisateur non trouvé');
            return res.redirect('/?error=Email ou mot de passe incorrect');
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        console.log('Mot de passe valide:', isValid);
        
        if (!isValid) {
            console.log('Mot de passe invalide');
            return res.redirect('/?error=Email ou mot de passe incorrect');
        }
        
        // Créer la session
        req.session.user = {
            id: user._id,
            email: user.email,
            username: user.username || 'Admin',
            role: user.role || 'admin'
        };
        
        console.log('Session utilisateur créée:', req.session.user);
        
        // Sauvegarder explicitement la session
        req.session.save(err => {
            if (err) {
                console.error('Erreur sauvegarde session:', err);
                return res.redirect('/?error=Erreur lors de la connexion');
            }
            
            console.log('Session sauvegardée, redirection vers /dashboard');
            return res.redirect('/dashboard');
        });
        
    } catch (error) {
        console.error('Erreur de connexion:', error);
        return res.redirect('/?error=Erreur lors de la connexion');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router; 