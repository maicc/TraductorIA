import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import prisma from '../lib/prisma';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: {
    'api-version': '2024-02-15-preview',
  },
  defaultHeaders: {
    'api-key': process.env.AZURE_OPENAI_API_KEY!,
  },
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
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

    await prisma.translation.create({
      data: {
        original: text,
        translated,
        sourceLang,
        targetLang,
        modelUsed: process.env.AZURE_OPENAI_DEPLOYMENT!,
      },
    });

    res.json({ translated });

  } catch (error) {
    console.error('Error en Azure OpenAI:', error);
    res.status(500).json({ error: 'Error al traducir con Azure OpenAI' });
  }
});

export default router;
