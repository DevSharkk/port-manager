const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const SECRET_KEY = 'monsecret'; // À mettre dans un fichier `.env`

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Utilisateurs]
 *     summary: Liste tous les utilisateurs
 * 
 *   post:
 *     tags: [Utilisateurs]
 *     summary: Crée un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 * 
 * /api/users/{email}:
 *   get:
 *     tags: [Utilisateurs]
 *     summary: Récupère un utilisateur spécifique
 *   
 *   put:
 *     tags: [Utilisateurs]
 *     summary: Modifie un utilisateur
 *   
 *   delete:
 *     tags: [Utilisateurs]
 *     summary: Supprime un utilisateur
 */

// GET /users - Liste tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Impossible de récupérer les utilisateurs',
      error: error.message
    });
  }
});

// GET /users/:email - Récupère un utilisateur spécifique
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération de l\'utilisateur',
      error: error.message
    });
  }
});

// POST /users - Crée un nouvel utilisateur
router.post('/', async (req, res) => {
  try {
    console.log('Données reçues dans la route POST:', req.body); // Debug

    if (!req.body.username || !req.body.email || !req.body.password) {
      console.log('Données manquantes:', { 
        username: !!req.body.username, 
        email: !!req.body.email, 
        password: !!req.body.password 
      }); // Debug
      return res.status(400).json({
        status: 'error',
        message: 'Tous les champs sont requis'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log('Email déjà existant:', req.body.email); // Debug
      return res.status(400).json({
        status: 'error',
        message: 'Cet email est déjà utilisé'
      });
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUsername = await User.findOne({ username: req.body.username });
    if (existingUsername) {
      return res.status(400).json({
        status: 'error',
        message: 'Ce nom d\'utilisateur est déjà utilisé'
      });
    }

    // Créer le nouvel utilisateur
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    await user.save();
    console.log('Utilisateur créé avec succès'); // Debug

    res.status(201).json({
      status: 'success',
      message: 'Utilisateur créé avec succès'
    });

  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Erreur lors de la création de l\'utilisateur'
    });
  }
});

// PUT /users/:email - Modifie un utilisateur
router.put('/:email', async (req, res) => {
  try {
    const updateData = {};
    if (req.body.username) updateData.username = req.body.username;
    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Utilisateur modifié avec succès',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la modification de l\'utilisateur',
      error: error.message
    });
  }
});

// DELETE /users/:email - Supprime un utilisateur
router.delete('/:email', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: error.message
    });
  }
});

module.exports = router;
