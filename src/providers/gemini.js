// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - Google Gemini Vision Provider Adapter
 */

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { VisionProvider } = require('./base');

class GeminiVisionProvider extends VisionProvider {
    /**
     * @param {Object} options
     * @param {string} options.apiKey - Google Gemini API Key
     * @param {string} [options.modelName] - Gemini model identifier (default: "gemini-2.5-pro")
     * @param {Object} [options.generationConfig] - Optional model generation config
     */
    constructor(options = {}) {
        super();
        const key = options.apiKey || process.env.GEMINI_API_KEY;
        if (!key || key.startsWith('YOUR_') || key.length < 20) {
            throw new Error("GeminiVisionProvider requires a valid GEMINI_API_KEY.");
        }
        this.genAI = new GoogleGenerativeAI(key);
        this.modelName = options.modelName || process.env.GEMINI_SYNTH_MODEL || "gemini-2.5-pro";
        this.generationConfig = options.generationConfig || { temperature: 0.0, topK: 1, topP: 0.1 };
        this.model = this.genAI.getGenerativeModel({ 
            model: this.modelName,
            generationConfig: this.generationConfig
        });
    }

    formatFilePart(fileInput) {
        if (!fileInput) return null;

        // If already formatted part
        if (fileInput.inlineData) return fileInput;

        // If file buffer with mimeType object
        if (fileInput.buffer && fileInput.mimetype) {
            return {
                inlineData: {
                    data: fileInput.buffer.toString("base64"),
                    mimeType: fileInput.mimetype
                }
            };
        }

        // If Buffer without explicit mimetype
        if (Buffer.isBuffer(fileInput)) {
            return {
                inlineData: {
                    data: fileInput.toString("base64"),
                    mimeType: "image/png"
                }
            };
        }

        // If file path string
        if (typeof fileInput === 'string' && fs.existsSync(fileInput)) {
            const buf = fs.readFileSync(fileInput);
            const ext = path.extname(fileInput).toLowerCase();
            const mimeMap = {
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.webp': 'image/webp',
                '.pdf': 'application/pdf'
            };
            const mimeType = mimeMap[ext] || 'image/png';
            return {
                inlineData: {
                    data: buf.toString("base64"),
                    mimeType
                }
            };
        }

        return { text: String(fileInput) };
    }

    async generateContent(parts) {
        const cleanParts = parts.filter(Boolean);
        const result = await this.model.generateContent(cleanParts);
        return result.response.text();
    }
}

module.exports = { GeminiVisionProvider };
