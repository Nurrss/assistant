import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found');
  process.exit(1);
}

console.log('🔍 Fetching available models from Google AI...\n');

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

try {
  const response = await fetch(url);
  const data = await response.json();

  if (response.ok) {
    console.log('✅ API Key is valid!\n');
    console.log('Available models:');
    console.log('─'.repeat(60));

    if (data.models && data.models.length > 0) {
      data.models.forEach(model => {
        console.log(`\n📦 ${model.name}`);
        console.log(`   Display Name: ${model.displayName}`);
        console.log(`   Description: ${model.description}`);

        if (model.supportedGenerationMethods) {
          console.log(`   Supports: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });

      console.log('\n' + '─'.repeat(60));
      console.log('💡 Recommended models for your use case:');

      const generateModels = data.models.filter(m =>
        m.supportedGenerationMethods?.includes('generateContent')
      );

      if (generateModels.length > 0) {
        generateModels.slice(0, 3).forEach(m => {
          const modelId = m.name.replace('models/', '');
          console.log(`   ✓ ${modelId}`);
        });
      }
    } else {
      console.log('⚠️  No models found');
    }
  } else {
    console.error('❌ API Error:', data.error?.message || 'Unknown error');
    console.error('\nPossible issues:');
    console.error('1. Invalid API key');
    console.error('2. API not enabled in Google Cloud Console');
    console.error('3. Quota exceeded');
    console.error('\n💡 Get a new API key at: https://aistudio.google.com/app/apikey');
  }
} catch (error) {
  console.error('❌ Network Error:', error.message);
}
