"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openai_1 = __importDefault(require("openai"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
const openai = new openai_1.default({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
    defaultQuery: {
        'api-version': '2024-02-15-preview',
    },
    defaultHeaders: {
        'api-key': process.env.AZURE_OPENAI_API_KEY,
    },
});
router.post('/', async (req, res) => {
    const { text, sourceLang, targetLang } = req.body;
    if (!text || !sourceLang || !targetLang) {
        res.status(400).json({ error: 'Faltan datos' });
        return;
    }
    try {
        const completion = await openai.chat.completions.create({
            model: '', // obligatorio dejar vacío en Azure
            messages: [
                {
                    role: 'system',
                    content: `Traduce del ${sourceLang} al ${targetLang}.`,
                },
                {
                    role: 'user',
                    content: text,
                },
            ],
        });
        const translated = completion.choices[0]?.message?.content || '';
        await prisma_1.default.translation.create({
            data: {
                original: text,
                translated,
                sourceLang,
                targetLang,
                modelUsed: process.env.AZURE_OPENAI_DEPLOYMENT,
            },
        });
        res.json({ translated });
    }
    catch (error) {
        console.error('Error en Azure OpenAI:', error);
        res.status(500).json({ error: 'Error al traducir con Azure OpenAI' });
    }
});
exports.default = router;
