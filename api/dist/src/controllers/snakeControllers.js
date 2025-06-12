import * as snakeServices from "../services/snakeServices.js";
export async function getSnakeLeaderboard(req, res) {
    try {
        const leaderboard = await snakeServices.getTop10Scores();
        res.status(200).json(leaderboard);
    }
    catch (error) {
        console.error("Error fetching snake leaderboard:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export async function saveSnakeScore(req, res) {
    const { name, score } = req.body;
    if (!name || !score) {
        return res.status(400).json({ error: "Username and score are required" });
    }
    try {
        const result = await snakeServices.submitSnakeScore(name, score);
        res.status(201).json(result);
    }
    catch (error) {
        console.error("Error saving snake score:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
//# sourceMappingURL=snakeControllers.js.map