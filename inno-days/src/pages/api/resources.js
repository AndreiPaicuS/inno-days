import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            const resources = await prisma.resource.findMany();
            res.status(200).json(resources);
            break;
        case 'POST':
            const { firstName, lastName, skillId, levelOfExpertise, project, yearsAtNatterbox, endDate } = req.body;
            const newResource = await prisma.resource.create({
                data: {
                    firstName,
                    lastName,
                    skillId: Number(skillId),
                    levelOfExpertise,
                    project,
                    yearsAtNatterbox: Number(yearsAtNatterbox),
                    endDate: new Date(endDate) // Add endDate field
                },
            });
            res.status(201).json(newResource);
            break;
        case 'PUT':
            const { resourceId, ...updateData } = req.body;
            if ('skillId' in req.body) {
                updateData.skillId = Number(req.body.skillId);
            }
            if ('yearsAtNatterbox' in req.body) {
                updateData.yearsAtNatterbox = Number(req.body.yearsAtNatterbox);
            }
            if ('endDate' in req.body) {
                updateData.endDate = new Date(req.body.endDate);
            }

            const updatedResource = await prisma.resource.update({
                where: { id: resourceId },
                data: updateData,
            });
            res.status(200).json(updatedResource);
            break;
        case 'DELETE':
            const { id } = req.body;
            await prisma.resource.delete({
                where: { id },
            });
            res.status(204).end();
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
            break;
    }
}
