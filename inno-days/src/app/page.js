import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Home() {
  // Create a new skill
  const newSkill = await prisma.skill.create({
    data: {
      skillName: 'JavaScript',
    },
  });

  // Read all skills
  const skills = await prisma.skill.findMany();

  // Update a skill
  const updatedSkill = await prisma.skill.update({
    where: { id: newSkill.id },
    data: { skillName: 'TypeScript' },
  });

  // Delete a skill
  const deletedSkill = await prisma.skill.delete({
    where: { id: newSkill.id },
  });

  return (
      <div>
        <h1>Skills</h1>
        <ul>
          {skills.map(skill => (
              <li key={skill.id}>{skill.skillName}</li>
          ))}
        </ul>
      </div>
  );
}
