const express = require('express');
const mongoose = require('mongoose');
const Catway = require('../models/Catway');
const router = express.Router();

/**
 * @swagger
 * /api/catways:
 *   get:
 *     summary: Voir tous les catways
 *     tags: [Catways]
 *     responses:
 *       200:
 *         description: Liste des catways disponibles
 * 
 *   post:
 *     summary: Créer un nouveau catway
 *     tags: [Catways]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             catwayNumber: 1
 *             catwayType: "grand"
 *             catwayState: "disponible"
 * 
 * /api/catways/{numero}:
 *   get:
 *     summary: Voir un catway spécifique
 *     tags: [Catways]
 *     parameters:
 *       - name: numero
 *         in: path
 *         description: Numéro du catway
 *         required: true
 *         example: 1
 * 
 *   put:
 *     summary: Modifier l'état d'un catway
 *     tags: [Catways]
 *     parameters:
 *       - name: numero
 *         in: path
 *         required: true
 *         example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             catwayState: "occupé"
 * 
 *   delete:
 *     summary: Supprimer un catway
 *     tags: [Catways]
 *     parameters:
 *       - name: numero
 *         in: path
 *         required: true
 *         example: 1
 */

// Route pour récupérer tous les catwais
router.get('/', async (req, res) => {
  try {
    // Récupère tous les documents de la collection Catways
    const catways = await Catway.find();
    
    // Renvoie les catwais avec un statut 200 (OK)
    res.status(200).json({
      status: 'success',
      results: catways.length,
      data: catways
    });
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({
      status: 'error',
      message: 'Impossible de récupérer les catwais',
      error: error.message
    });
  }
});

// Route pour récupérer un catwai spécifique par son numéro
router.get('/:number', async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.number });
    
    if (!catway) {
      return res.status(404).json({
        status: 'error',
        message: 'Catwai non trouvé'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: catway
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération du catwai',
      error: error.message
    });
  }
});

// Ajouter un nouveau catway
router.post('/', async (req, res) => {
  try {
    const newCatway = new Catway({
      catwayNumber: req.body.catwayNumber,
      catwayType: req.body.catwayType,
      catwayState: req.body.catwayState
    });
    
    await newCatway.save();
    
    // Redirection au lieu d'une réponse JSON
    res.redirect('/catways');
  } catch (err) {
    console.error('Erreur lors de l\'ajout du catway :', err);
    res.status(500).json({ 
      message: 'Erreur lors de l\'ajout du catway',
      error: err.message 
    });
  }
});

// Modifier un catway
router.put('/:id', async (req, res) => {
    try {
        const catway = await Catway.findByIdAndUpdate(
            req.params.id,
            { catwayState: req.body.catwayState },
            { new: true }
        );

        if (!catway) {
            return res.status(404).json({
                status: 'error',
                message: 'Catway non trouvé'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Catway modifié avec succès',
            data: catway
        });
    } catch (error) {
        console.error('Erreur modification catway:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la modification du catway',
            error: error.message
        });
    }
});

// Route pour supprimer un catway
router.delete('/:number', async (req, res) => {
  try {
    const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.number });
    
    if (!catway) {
      return res.status(404).json({
        status: 'error',
        message: 'Catwai non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Catwai supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression du catwai',
      error: error.message
    });
  }
});

module.exports = router;
