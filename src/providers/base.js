// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - Base Vision Provider Interface
 */

class VisionProvider {
    /**
     * Generates text content from multimodal prompt parts.
     * @param {Array<Object|string>} parts
     * @returns {Promise<string>} Raw text output from model
     */
    async generateContent(parts) {
        throw new Error("Method generateContent() must be implemented by subclass.");
    }

    /**
     * Formats an input file (buffer, base64 string, or filepath) into a provider-compatible part.
     * @param {Buffer|string|Object} fileInput
     * @returns {Object}
     */
    formatFilePart(fileInput) {
        throw new Error("Method formatFilePart() must be implemented by subclass.");
    }
}

module.exports = { VisionProvider };
