const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
    // Vérifier si l'utilisateur est connecté
    if (!req.session.user) {
        return res.redirect('/');
    }
    next();
}

function isAdmin(req, res, next) {
    // Vérifier si l'utilisateur est un admin
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/dashboard');
    }
    next();
}

module.exports = { isAuthenticated, isAdmin }; 