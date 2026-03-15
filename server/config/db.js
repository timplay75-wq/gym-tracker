import mongoose from 'mongoose';
import dns from 'dns';

// Используем Google DNS для резолва SRV записей Atlas
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4, // использовать IPv4
    });
    console.log(`✅ MongoDB подключена: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Ошибка подключения к MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
