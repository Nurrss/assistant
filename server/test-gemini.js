import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

console.log('🔑 API Key:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));
console.log('\n🧪 Testing Gemini models...\n');

const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTest = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.0-flash',
  'gemini-2.5-pro',
  'gemini-pro-latest'
];

async function testModel(modelName) {
  try {
    console.log(`Testing: ${modelName}`);
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent('Сәлем! Қалың қалай?');
    const response = await result.response;
    const text = response.text();

    console.log(`✅ SUCCESS: ${modelName}`);
    console.log(`   Response: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
    console.log('');

    return { model: modelName, success: true, response: text };
  } catch (error) {
    console.log(`❌ FAILED: ${modelName}`);
    console.log(`   Error: ${error.message}`);
    console.log('');

    return { model: modelName, success: false, error: error.message };
  }
}

async function main() {
  const results = [];

  for (const modelName of modelsToTest) {
    const result = await testModel(modelName);
    results.push(result);
  }

  console.log('\n📊 Summary:');
  console.log('─'.repeat(60));

  const working = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Working models: ${working.length}`);
  working.forEach(r => console.log(`   - ${r.model}`));

  console.log(`\n❌ Failed models: ${failed.length}`);
  failed.forEach(r => console.log(`   - ${r.model}`));

  if (working.length > 0) {
    console.log(`\n💡 Recommended model: ${working[0].model}`);
  } else {
    console.log('\n⚠️  No working models found. Please check your API key.');
    console.log('   Get a new key at: https://makersuite.google.com/app/apikey');
  }
}

main().catch(console.error);
