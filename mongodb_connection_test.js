require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testMongoConnection() {
  const uri = process.env.DB_URI;
  
  console.log('URI de connexion :', uri);

  try {
    // Créer un nouveau client MongoDB
    const client = new MongoClient(uri);

    // Se connecter au serveur
    await client.connect();
    console.log('✅ Connexion réussie à MongoDB');

    // Obtenir la base de données
    const database = client.db('Russel_port_manage');
    console.log('📁 Base de données sélectionnée :', database.databaseName);

    // Lister les collections
    const collections = await database.listCollections().toArray();
    console.log('📋 Collections disponibles :');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Vérifier la collection 'catways'
    const catwaysCollection = database.collection('Catways');
    const catwaysCount = await catwaysCollection.countDocuments();
    console.log(`🚢 Nombre de catwais : ${catwaysCount}`);

    if (catwaysCount > 0) {
      const firstCatway = await catwaysCollection.findOne();
      console.log('🔍 Premier catway :', firstCatway);
    }

    // Fermer la connexion
    await client.close();
  } catch (error) {
    console.error('❌ Erreur de connexion :', error.message);
  }
}

testMongoConnection();
