"use client"

import { useState, useEffect } from 'react';

export default function Home() {
    const [skills, setSkills] = useState([]);
    const [skillName, setSkillName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editSkillId, setEditSkillId] = useState(null);

    // Fetch skills on component mount
    useEffect(() => {
        async function fetchSkills() {
            const response = await fetch('/api/skills');
            const skills = await response.json();
            setSkills(skills);
        }
        fetchSkills();
    }, []);

    // Function to add or edit a skill
    async function handleSkill() {
        if (isEditing) {
            await fetch(`/api/skills`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ skillName, skillId: editSkillId }),
            });
            setSkills(skills.map(skill => skill.id === editSkillId ? { ...skill, skillName } : skill));
            setIsEditing(false);
            setEditSkillId(null);
        } else {
            const response = await fetch('/api/skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ skillName }),
            });
            const newSkill = await response.json();
            setSkills([...skills, newSkill]);
        }
        setSkillName(''); // Clear the input field
    }

    // Function to delete a skill by ID
    async function deleteSkill(id) {
        await fetch('/api/skills', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        setSkills(skills.filter(skill => skill.id !== id));
    }

    // Function to edit a skill by ID
    function editSkill(id) {
        const skill = skills.find(skill => skill.id === id);
        setSkillName(skill.skillName);
        setIsEditing(true);
        setEditSkillId(id);
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Skills</h1>
            <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="mb-4 px-4 py-2 border rounded"
                placeholder="Enter skill name"
            />
            <button
                onClick={handleSkill}
                className={`mb-4 px-4 py-2 ${isEditing ? 'bg-yellow-500' : 'bg-blue-500'} text-white rounded hover:${isEditing ? 'bg-yellow-700' : 'bg-blue-700'}`}
            >
                {isEditing ? 'Edit Skill' : 'Add Skill'}
            </button>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Skill Name</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                </tr>
                </thead>
                <tbody>
                {skills.map(skill => (
                    <tr key={skill.id}>
                        <td className="py-2 px-4 border-b">{skill.id}</td>
                        <td className="py-2 px-4 border-b">{skill.skillName}</td>
                        <td className="py-2 px-4 border-b text-right">
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => deleteSkill(skill.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => editSkill(skill.id)}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
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
    );
}
