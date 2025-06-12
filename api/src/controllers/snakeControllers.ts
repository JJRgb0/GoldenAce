import * as snakeServices from "../services/snakeServices.js";
import { Request, Response } from 'express';
import { config } from '../config/index.js';
import crypto from 'crypto';

export async function getSnakeLeaderboard(req: Request, res: Response): Promise<any> {
    try {
        const leaderboard = await snakeServices.getTop10Scores();
        res.status(200).json(leaderboard);
    }
    catch (error) {
        console.error("Error fetching snake leaderboard:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function saveSnakeScore(req: Request, res: Response): Promise<any> {
    const { name, score, hash: receivedHash } = req.body;

    if (!name || score == null || score == undefined || !receivedHash) {
        return res.status(400).json({ error: "Username score and hash are required" });
    }

    const secretKey = config.apiKey;
    const dataToHash = `${name}${score}${secretKey}`;
    const expectedHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    if (receivedHash !== expectedHash) {
        return res.status(403).json({ error: "Invalid hash" });
    }

    try {
        const result = await snakeServices.submitSnakeScore(name, score);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error saving snake score:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}