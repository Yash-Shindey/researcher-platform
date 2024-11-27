import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import { ResearcherModel } from '../src/models/Researcher';

const importData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/researcher-platform');
    console.log('Connected to MongoDB');

    // Clear existing data
    await ResearcherModel.deleteMany({});
    console.log('Cleared existing data');

    const researchers: any[] = [];

    // Read and parse CSV file with the correct path
    await new Promise((resolve, reject) => {
      fs.createReadStream('./data/source/india.csv')  // Updated path
        .pipe(csv())
        .on('data', (row) => {
          // Transform CSV data to match our schema
          const researcher = {
            authfull: row.authfull,
            inst_name: row.inst_name,
            cntry: row.cntry,
            metrics: {
              h23: parseInt(row.h23) || 0,
              nc9623: parseInt(row.nc9623) || 0,
              selfCitationExcluded: {
                h23: parseInt(row['h23 (ns)']) || 0,
                nc9623: parseInt(row['nc9623 (ns)']) || 0
              }
            },
            fields: {
              primary: {
                name: row['sm-subfield-1'] || 'Unknown',
                rank: parseInt(row['rank sm-subfield-1']) || 0
              },
              secondary: [
                {
                  name: row['sm-subfield-2'] || '',
                  fraction: parseFloat(row['sm-subfield-2-frac']) || 0
                }
              ]
            }
          };
          researchers.push(researcher);
        })
        .on('end', () => {
          console.log(`Parsed ${researchers.length} researchers from CSV`);
          resolve(true);
        })
        .on('error', reject);
    });

    // Insert data in batches
    const batchSize = 100;
    for (let i = 0; i < researchers.length; i += batchSize) {
      const batch = researchers.slice(i, i + batchSize);
      await ResearcherModel.insertMany(batch, { ordered: false });
      console.log(`Imported researchers ${i + 1} to ${i + batch.length}`);
    }

    console.log('Data import completed successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await mongoose.disconnect();
  }
};

importData();
