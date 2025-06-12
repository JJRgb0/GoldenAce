import { prisma } from '../server.js';
export async function getTop10Scores() {
    return await prisma.SnakeScores.findMany({
        orderBy: {
            score: 'desc',
        },
        take: 10,
    });
}
export async function submitSnakeScore(name, score) {
    const topScores = await getTop10Scores();
    if (topScores.length < 10 || score > topScores[topScores.length - 1].score) {
        if (topScores.length === 10) {
            await prisma.SnakeScores.delete({
                where: {
                    id: topScores[topScores.length - 1].id,
                },
            });
        }
        return await prisma.SnakeScores.create({
            data: {
                name,
                score,
            },
        });
    }
    else {
        return {
            message: "Score not high enough to be in the top 10",
        };
    }
}
//# sourceMappingURL=snakeServices.js.map