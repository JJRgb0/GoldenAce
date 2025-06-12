import { prisma } from '../server.js';

export async function getTop10Scores() {
    return await prisma.snakeScores.findMany({
        orderBy: {
            score: 'desc',
        },
        take: 10,
    })
}

export async function submitSnakeScore(name: string, score: number) {
    const topScores = await getTop10Scores();

    if (topScores.length < 10 || score > topScores[topScores.length - 1].score) {
        if (topScores.length === 10) {
            await prisma.snakeScores.delete({
                where: {
                    id: topScores[topScores.length - 1].id,
                },
            });
        }

        return await prisma.snakeScores.create({
            data: {
                name,
                score,
            },
        });
    } else {
        return {
            message: "Score not high enough to be in the top 10",
        };
    }
}