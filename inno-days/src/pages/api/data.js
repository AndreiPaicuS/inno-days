import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Fetch data from the backend (adjust queries as needed)
      const resources = await prisma.resource.findMany();
      const skills = await prisma.skill.findMany();

      // Combine the data into a single response
      res.status(200).json({ resources, skills });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
