# Aura Therapy Chat - AI Companion

A beautiful, therapeutic chat interface powered by a custom fine-tuned TinyLlama model with intelligent fallback support.

## Note to AML Graders
- This project has been deployed at https://aura-therapy-chat.onrender.com/ and is publicly accessible. It may take a few minutes to load if it has not been accessed by anyone over the past 60 minutes (due to using the free tier of Render). If you cannot get the public URL to work, either follow the instructions below to run it locally, or contact Kyle Coletta (248-798-6924) to get the site up and running again!

## Features

- **Dual Model System**: Custom Inference Endpoint with automatic fallback to public models (this is in case the fine-tuned model endpoint becomes unavailable, as we do not want to leave it running full time due to cost).
- **Multiple Themes**: Choose from Default, Space, Rainbow, Forest, and Ocean
- Clean, calming interface designed for therapeutic conversations
- Real-time chat with AI model
- Responsive design (works on mobile and desktop)
- Smooth animations and transitions
- Automatic fallback when custom endpoint is unavailable

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- A Hugging Face API key ([Get one here](https://huggingface.co/settings/tokens))
  - For Router API fallback: Read-only token is sufficient
  - For custom Inference Endpoint: May require write permissions

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd aura-therapy-chat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure your environment:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and configure:
     ```
     HUGGINGFACE_API_KEY=hf_your_actual_api_key_here
     PORT=3000

     # Optional: Add custom Inference Endpoint URL
     # If not set, will use fallback public model (meta-llama/Llama-3.2-3B-Instruct)
     # Use the below for our fine-tuned tinyllama model
     HF_ENDPOINT_URL=https://xdz4qzthpwd4knlq.us-east-1.aws.endpoints.huggingface.cloud/
     ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open your browser:**
   Visit `http://localhost:3000`

## Project Structure

```
aura-therapy-chat/
├── public/
│   ├── index.html          # Main HTML file
│   ├── script.js           # Frontend JavaScript & theme logic
│   └── styles/
│       ├── base.css        # Base styles and layout
│       ├── themes.css      # All theme definitions
│       ├── space.css       # Space theme
│       ├── unicorn.css     # Unicorn/Rainbow theme
│       ├── forest.css      # Forest theme
│       ├── ocean.css       # Ocean theme
│       └── sunset.css      # Sunset theme
├── server.js               # Express server + API integration
├── package.json            # Dependencies
├── .env                    # Environment variables (create from .env.example)
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore file
└── README.md              # This file
```

## Customization

### Switching Themes

The app includes 5 built-in themes that can be changed via the theme selector in the UI:
- **Space**: Dark, cosmic theme with purple and blue accents, shooting starts, and planets
- **Rainbow**: Vibrant, pink theme with rainbows and sparkles
- **Forest**: Natural green tones, with trees and animated birds and squirrels
- **Ocean**: Calming blue shades, with kelp and swimming fish

Themes are stored in `public/styles/` and automatically persist in localStorage.

### Creating a New Theme

1. Create a new CSS file in `public/styles/` (e.g., `mytheme.css`)
2. Define theme-specific CSS variables:
   ```css
   [data-theme="mytheme"] {
       --primary: #your-color;
       --secondary: #your-color;
       --accent: #your-color;
       /* ... other variables ... */
   }
   ```
3. Add the theme to the selector in `public/index.html`
4. Add the stylesheet link in `public/index.html`

## Troubleshooting

### "API key not configured" error
- Make sure you've created a `.env` file (not just `.env.example`)
- Verify your API key is correct and starts with `hf_`
- Restart the server after updating `.env`

### Custom endpoint unavailable
- Check if your Inference Endpoint is running in the [Hugging Face dashboard](https://ui.endpoints.huggingface.co/)
- Verify the endpoint URL in `.env` is correct
- The app will automatically fall back to the public Router API
- Check server logs to see which model is being used

### Model takes a long time to respond
- Hugging Face Inference Endpoints may need to "wake up" if they haven't been used recently (cold start)
- First request might take 20-60 seconds
- Subsequent requests should be faster
- Consider using a dedicated endpoint for faster response times

### "Model not supported" error
- This means the model isn't available through your Router API providers
- Enable the required provider at: https://huggingface.co/settings/router
- Or change to a different fallback model in `server.js`

### Port already in use
- Change the PORT in your `.env` file
- Or stop the other process using port 3000:
  ```bash
  # macOS/Linux
  lsof -ti:3000 | xargs kill

  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### Cloning to a new machine
- `.env` is not included in git (for security)
- You'll need to recreate the `.env` file and add your API key
- Copy from `.env.example` as a template

## License

MIT License - Feel free to use this for any purpose!

## Support

If you encounter issues:
1. Check the browser console (F12) for frontend errors
2. Check the server terminal for backend errors
3. Verify your API key is valid at https://huggingface.co/settings/tokens
4. Verify your custom endpoint is running at https://ui.endpoints.huggingface.co/
5. Check Hugging Face status page: https://status.huggingface.co/

## 📚 Additional Resources

- [Hugging Face Inference Endpoints Documentation](https://huggingface.co/docs/inference-endpoints/)
- [Model Card: ZooDka/Aura-Therapy-Model](https://huggingface.co/ZooDka/Aura-Therapy-Model)

## Enjoy!

Your Aura Therapy chatbot is ready to provide compassionate AI companionship with beautiful themes and intelligent fallback support!
