import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const skills = await prisma.skill.findMany();
        res.status(200).json(skills);
    } else if (req.method === 'POST') {
        const { skillName } = req.body;
        const newSkill = await prisma.skill.create({
            data: {
                skillName,
            },
        });
        res.status(201).json(newSkill);
    } else if (req.method === 'DELETE') {
        const { id } = req.body;
        await prisma.skill.delete({
            where: { id },
        });
        res.status(204).end();
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
