# Aura Therapy Chat - AI Companion

A beautiful, therapeutic chat interface powered by your Hugging Face model: `ZooDka/Aura-Therapy-Model-Exported`

## 🌟 Features

- Clean, calming interface designed for therapeutic conversations
- Real-time chat with your AI model
- Responsive design (works on mobile and desktop)
- Smooth animations and transitions
- No user configuration needed - model is pre-configured

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- A Hugging Face API key ([Get one here](https://huggingface.co/settings/tokens))

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd aura-therapy-chat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure your API key:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Hugging Face API key:
     ```
     HUGGINGFACE_API_KEY=hf_your_actual_api_key_here
     PORT=3000
     ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open your browser:**
   Visit `http://localhost:3000`

## 📁 Project Structure

```
aura-therapy-chat/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # All styling
│   └── script.js       # Frontend JavaScript
├── server.js           # Express server + API integration
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `public/styles.css`:

```css
:root {
    --primary: #8b7355;        /* Main brand color */
    --secondary: #d4b5a0;      /* Secondary accent */
    --accent: #e8d5c4;         /* Light accent */
    /* ... more variables ... */
}
```

### Changing Fonts

Fonts are loaded from Google Fonts. To change them:

1. Find fonts on [Google Fonts](https://fonts.google.com)
2. Update the `<link>` in `public/index.html`
3. Update the `font-family` in `public/styles.css`

### Modifying the Welcome Message

Edit the initial message in `public/index.html` (around line 28).

### Adjusting Model Parameters

Edit the API call parameters in `server.js` (around line 38):

```javascript
parameters: {
    max_new_tokens: 300,    // Max response length
    temperature: 0.7,       // Creativity (0.0 - 1.0)
    top_p: 0.95,           // Nucleus sampling
    return_full_text: false
}
```

## 🌐 Deployment Options

### Option 1: Deploy to Render (Recommended - Free)

1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Create a new "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variable: `HUGGINGFACE_API_KEY`
7. Deploy!

### Option 2: Deploy to Railway

1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Create a new project from your GitHub repo
4. Add environment variable: `HUGGINGFACE_API_KEY`
5. Railway will auto-detect and deploy

### Option 3: Deploy to Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variable:
   ```bash
   heroku config:set HUGGINGFACE_API_KEY=your_key_here
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```

### Option 4: Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Add environment variable in Vercel dashboard

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HUGGINGFACE_API_KEY` | Your Hugging Face API key | Yes |
| `PORT` | Port to run the server on | No (defaults to 3000) |

## 🐛 Troubleshooting

### "API key not configured" error
- Make sure you've created a `.env` file
- Verify your API key is correct
- Restart the server after updating `.env`

### Model takes a long time to respond
- Hugging Face models may need to "wake up" if they haven't been used recently
- First request might take 20-30 seconds
- Subsequent requests should be faster

### Port already in use
- Change the PORT in your `.env` file
- Or stop the other process using port 3000

## 📝 Development

To make changes:

1. Edit files in VS Code or your preferred editor
2. Save your changes
3. Server will need to be restarted for backend changes:
   ```bash
   # Stop server (Ctrl+C)
   npm start
   ```
4. Frontend changes (HTML/CSS/JS in `public/`) just need a browser refresh

## 🤝 Contributing

This is your project! Modify it however you like. Some ideas:
- Add user authentication
- Save chat history
- Add voice input/output
- Implement typing indicators
- Add dark mode toggle

## 📄 License

MIT License - Feel free to use this for any purpose!

## 🆘 Support

If you encounter issues:
1. Check the console for errors
2. Verify your API key is valid
3. Make sure the model ID is correct
4. Check Hugging Face status page

## 🎉 Enjoy!

Your Aura Therapy chatbot is ready to provide compassionate AI companionship!
