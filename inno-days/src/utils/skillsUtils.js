import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addSkill = async (skillName) => {
    const newSkill = await prisma.skill.upsert({
        where: { skillName },
        update: {},
        create: { skillName },
    });

    return newSkill;
}
