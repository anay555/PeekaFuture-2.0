import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// --- Helper to load data from TS files without needing a TS runner ---
async function loadTsData(filePath) {
    try {
        const content = await readFile(filePath, 'utf8');
        // Find the start of the array `[` after the `=` sign
        const startIndex = content.indexOf('=') + 1;
        // Trim the content to get just the array definition
        let dataString = content.substring(startIndex).trim();
        // Remove trailing semicolon if it exists
        if (dataString.endsWith(';')) {
            dataString = dataString.slice(0, -1);
        }
        // Use the Function constructor as a safer alternative to eval
        return new Function(`return ${dataString}`)();
    } catch (error) {
        console.error(`Failed to load or parse data from ${filePath}`, error);
        throw error;
    }
}

// --- Firebase Admin Setup ---
const serviceAccount = JSON.parse(await readFile('./serviceAccountKey.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// --- Seeding Logic ---

async function seedCollection(collectionName, data, idField = 'id') {
  console.log(`Checking collection: ${collectionName}...`);
  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.limit(1).get();

  if (!snapshot.empty) {
    console.log(`Collection "${collectionName}" already contains data. Skipping seed.`);
    return;
  }

  console.log(`Seeding ${collectionName}...`);
  const batch = db.batch();
  let count = 0;

  data.forEach(item => {
    const docId = item[idField];
    if (!docId) {
        console.warn(`Skipping item in ${collectionName} due to missing ID:`, item);
        return;
    }
    const docRef = collectionRef.doc(docId.toString());
    // Remove the id field from the data being written to the document
    const { [idField]: _, ...docData } = item; 
    batch.set(docRef, docData);
    count++;
  });

  await batch.commit();
  console.log(`Successfully seeded ${count} documents into "${collectionName}".`);
}

async function seedDatabase() {
  try {
    console.log('Starting database seed process...');

    // Load data directly from the .ts files
    const collegeData = await loadTsData('../data/collegeData.ts');
    const entrepreneurshipData = await loadTsData('../data/entrepreneurshipData.ts');
    const streamData = await loadTsData('../data/streamData.ts');

    // Seed Colleges
    await seedCollection('colleges', collegeData, 'id');

    // Seed Entrepreneurship Data
    await seedCollection('entrepreneurship', entrepreneurshipData, 'id');
    
    // Seed Stream Data
    await seedCollection('streams', streamData, 'id');
    
    // Seed Career Data (derived from streamData)
    const careers = [];
     if (streamData.find(s => s.id === 'science')) {
        careers.push({ id: 'sci', stream: 'Science', avg_salary: 1500000 });
    }
    if (streamData.find(s => s.id === 'commerce')) {
        careers.push({ id: 'com', stream: 'Commerce', avg_salary: 1000000 });
    }
    if (streamData.find(s => s.id === 'arts')) {
        careers.push({ id: 'art', stream: 'Arts / Humanities', avg_salary: 800000 });
    }
    await seedCollection('careers', careers, 'id');

    console.log('\nDatabase seeding complete! Your Firestore is ready.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

await seedDatabase();
