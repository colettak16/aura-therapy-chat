require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Hugging Face Configuration
// If HF_ENDPOINT_URL is set, use Inference Endpoint with your custom model
// Otherwise, fall back to Router API with a public chat model
const HF_ENDPOINT_URL = process.env.HF_ENDPOINT_URL;
const USE_CUSTOM_MODEL = !!HF_ENDPOINT_URL;

const HF_MODEL = USE_CUSTOM_MODEL
    ? 'ZooDka/Aura-Therapy-Model-Exported'
    : 'meta-llama/Llama-3.2-3B-Instruct'; // Fallback public model

const HF_API_URL = USE_CUSTOM_MODEL
    ? HF_ENDPOINT_URL
    : 'https://router.huggingface.co/v1/chat/completions';

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Check if API key and endpoint are set
        const apiKey = process.env.HUGGINGFACE_API_KEY;
        if (!apiKey || apiKey === 'your_api_key_here') {
            return res.status(500).json({
                error: 'API key not configured. Please set HUGGINGFACE_API_KEY in your .env file.'
            });
        }

        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };

        let response;

        if (USE_CUSTOM_MODEL) {
            // Text generation format for Inference Endpoints
            // Send only the raw user message - endpoint handles instruction prompt
            response = await fetch(HF_API_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    inputs: message,
                    parameters: {
                        max_new_tokens: 100
                    }
                })
            });
        } else {
            // OpenAI-compatible chat format for Router API
            response = await fetch(HF_API_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    model: HF_MODEL,
                    messages: [
                        {
                            role: "system",
                            content: "You are a compassionate therapy assistant. Provide supportive, empathetic responses to help users with their emotional well-being."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    max_tokens: 150,
                    temperature: 0.8,
                    top_p: 0.9
                })
            });
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Hugging Face API Error:');
            console.error('Status:', response.status);
            console.error('URL:', HF_API_URL);
            console.error('Response:', errorText);

            // Try to parse as JSON
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.error || `API request failed with status ${response.status}`);
            } catch (e) {
                throw new Error(`API request failed: ${errorText}`);
            }
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Handle response format based on API type
        let aiResponse;
        if (USE_CUSTOM_MODEL) {
            // Text generation format - response is already clean from endpoint
            if (Array.isArray(data) && data[0]?.generated_text) {
                aiResponse = data[0].generated_text;
            } else if (data.generated_text) {
                aiResponse = data.generated_text;
            } else {
                console.error('Unexpected response format:', data);
                aiResponse = 'I hear you. Thank you for sharing that with me.';
            }
            aiResponse = aiResponse.trim();
        } else {
            // Chat completions format
            if (data.choices && data.choices[0]?.message?.content) {
                aiResponse = data.choices[0].message.content;
            } else {
                console.error('Unexpected response format:', data);
                aiResponse = 'I hear you. Thank you for sharing that with me.';
            }
            aiResponse = aiResponse.trim();
        }

        res.json({ response: aiResponse });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: error.message || 'An error occurred while processing your request.' 
        });
    }
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🌟 Aura Therapy Chat server running on http://localhost:${PORT}`);
    console.log(`📝 API Key: ${process.env.HUGGINGFACE_API_KEY ? '✅ Configured' : '❌ Not set'}`);
    console.log(`🤖 Model: ${HF_MODEL}`);

    if (USE_CUSTOM_MODEL) {
        console.log(`✅ Using custom Inference Endpoint`);
        console.log(`   ${HF_ENDPOINT_URL.substring(0, 60)}...`);
    } else {
        console.log(`⚠️  Using fallback public model (Router API)`);
        console.log(`   To use your custom model:`);
        console.log(`   1. Deploy at: https://huggingface.co/inference-endpoints/dedicated`);
        console.log(`   2. Add HF_ENDPOINT_URL to .env file`);
    }
});