import { PrismaClient } from '@prisma/client';

import { addSkill} from "@/utils/skillsUtils";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            const skills = await prisma.skill.findMany();
            res.status(200).json(skills);
            break;
        case 'POST':
            const { skillName } = req.body;
            const newSkill = await addSkill(skillName);
            res.status(201).json(newSkill);
            break;
        case 'DELETE':
            const { id } = req.body;
            await prisma.skill.delete({
                where: { id },
            });
            res.status(204).end();
            break;
        case 'PUT':
            const { skillId, skillName: newSkillName } = req.body;
            const updatedSkill = await prisma.skill.update({
                where: { id: skillId },
                data: { skillName: newSkillName },
            });
            res.status(200).json(updatedSkill);
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
            break;
    }
}
