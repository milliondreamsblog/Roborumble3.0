const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function clearRegistrations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const Registration = mongoose.model('Registration', new mongoose.Schema({}, { strict: false }));
    
    const result = await Registration.deleteMany({});
    console.log(`✅ Successfully deleted ${result.deletedCount} test registrations`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearRegistrations();
