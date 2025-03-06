const express = require('express');
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const router = express.Router();

/**
 * @swagger
 * /api/catways/{numero}/reservations:
 *   get:
 *     summary: Voir les réservations d'un catway
 *     tags: [Réservations]
 *     parameters:
 *       - name: numero
 *         in: path
 *         required: true
 *         example: 1
 * 
 *   post:
 *     summary: Créer une réservation
 *     tags: [Réservations]
 *     parameters:
 *       - name: numero
 *         in: path
 *         required: true
 *         example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             clientName: "Jean Dupont"
 *             boatName: "Le Majestique"
 *             startDate: "2024-03-20"
 *             endDate: "2024-03-25"
 * 
 * /api/catways/{numero}/reservations/{id}:
 *   put:
 *     summary: Modifier une réservation
 *     tags: [Réservations]
 *     parameters:
 *       - name: numero
 *         in: path
 *         required: true
 *         example: 1
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             endDate: "2024-03-30"
 * 
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Réservations]
 *     parameters:
 *       - name: numero
 *         in: path
 *         required: true
 *         example: 1
 *       - name: id
 *         in: path
 *         required: true
 */

// GET /catways/:id/reservations - Obtenir toutes les réservations d'un catway
router.get('/catways/:id/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find({ catwayNumber: req.params.id });
    res.status(200).json({
      status: 'success',
      results: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Impossible de récupérer les réservations',
      error: error.message
    });
  }
});

// GET /catways/:id/reservations/:idReservation - Obtenir une réservation spécifique
router.get('/catways/:id/reservations/:idReservation', async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.idReservation,
      catwayNumber: req.params.id
    });

    if (!reservation) {
      return res.status(404).json({
        status: 'error',
        message: 'Réservation non trouvée'
      });
    }

    res.status(200).json({
      status: 'success',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération de la réservation',
      error: error.message
    });
  }
});

// POST /catways/:id/reservations - Créer une nouvelle réservation
router.post('/catways/:id/reservations', async (req, res) => {
  try {
    const newReservation = new Reservation({
      ...req.body,
      catwayNumber: req.params.id
    });
    
    await newReservation.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Réservation créée avec succès',
      data: newReservation
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la création de la réservation',
      error: error.message
    });
  }
});

// PUT /catways/:id/reservations/:idReservation - Modifier une réservation
router.put('/catways/:id/reservations/:idReservation', async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      {
        _id: req.params.idReservation,
        catwayNumber: req.params.id
      },
      req.body,
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({
        status: 'error',
        message: 'Réservation non trouvée'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Réservation modifiée avec succès',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la modification de la réservation',
      error: error.message
    });
  }
});

// DELETE /catways/:id/reservations/:idReservation - Supprimer une réservation
router.delete('/catways/:id/reservations/:idReservation', async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndDelete({
      _id: req.params.idReservation,
      catwayNumber: req.params.id
    });

    if (!reservation) {
      return res.status(404).json({
        status: 'error',
        message: 'Réservation non trouvée'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Réservation supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de la réservation',
      error: error.message
    });
  }
});

module.exports = router;
