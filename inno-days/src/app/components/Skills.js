"use client";

import { useState, useEffect } from "react";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editSkillId, setEditSkillId] = useState(null);

  useEffect(() => {
    async function fetchSkills() {
      const response = await fetch("/api/skills");
      const skills = await response.json();
      setSkills(skills);
    }
    fetchSkills();
  }, []);

  async function handleSkill() {
    if (isEditing) {
      await fetch(`/api/skills`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skillName, skillId: editSkillId }),
      });
      setSkills(
        skills.map((skill) =>
          skill.id === editSkillId ? { ...skill, skillName } : skill
        )
      );
      setIsEditing(false);
      setEditSkillId(null);
    } else {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skillName }),
      });
      const newSkill = await response.json();
      setSkills([...skills, newSkill]);
    }
    setSkillName("");
  }

  async function deleteSkill(id) {
    await fetch("/api/skills", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    setSkills(skills.filter((skill) => skill.id !== id));
  }

  function editSkill(id) {
    const skill = skills.find((skill) => skill.id === id);
    setSkillName(skill.skillName);
    setIsEditing(true);
    setEditSkillId(id);
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Skills</h1>
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter skill name"
          />
          <button
            onClick={handleSkill}
            disabled={!skillName.trim()}
            className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
              !skillName.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : isEditing
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isEditing ? "Edit Skill" : "Add Skill"}
          </button>
        </div>
        <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">
                ID
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">
                Skill Name
              </th>
              <th className="py-3 px-4 text-right text-gray-600 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, index) => (
              <tr
                key={skill.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <td className="py-3 px-4 text-gray-700">{skill.id}</td>
                <td className="py-3 px-4 text-gray-700">{skill.skillName}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => editSkill(skill.id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
