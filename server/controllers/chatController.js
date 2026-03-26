const aiService = require('../services/aiService');

exports.handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        const response = await aiService.generateChatResponse(message, history || []);
        res.json({ reply: response });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong parsing the AI chat request." });
    }
};
