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
    const users = await User.find().select('-password'); // Exclut le mot de passe
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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: req.body.role || 'user'
    });
    
    await newUser.save();
    
    const userWithoutPassword = { ...newUser.toObject() };
    delete userWithoutPassword.password;
    
    res.status(201).json({
      status: 'success',
      message: 'Utilisateur créé avec succès',
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message
    });
  }
});

// PUT /users/:email - Modifie un utilisateur
router.put('/:email', async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    ).select('-password');
    
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
