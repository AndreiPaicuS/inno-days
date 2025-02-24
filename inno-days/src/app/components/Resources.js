"use client"

import { useState, useEffect } from 'react';

export default function Resources() {
    const [resources, setResources] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resource, setResource] = useState({
        firstName: '',
        lastName: '',
        skillId: '',
        levelOfExpertise: 'junior',
        project: '',
        yearsAtNatterbox: '',
        endDate: '' // Add endDate field
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editResourceId, setEditResourceId] = useState(null);

    useEffect(() => {
        async function fetchResources() {
            const response = await fetch('/api/resources');
            const resources = await response.json();
            setResources(resources);
        }
        async function fetchSkills() {
            const response = await fetch('/api/skills');
            const skills = await response.json();
            setSkills(skills);
        }
        fetchResources();
        fetchSkills();
    }, []);

    async function handleResource() {
        if (isEditing) {
            await fetch(`/api/resources`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...resource, resourceId: editResourceId }),
            });
            setResources(resources.map(res => res.id === editResourceId ? { ...res, ...resource } : res));
            setIsEditing(false);
            setEditResourceId(null);
        } else {
            const response = await fetch('/api/resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resource),
            });
            const newResource = await response.json();
            setResources([...resources, newResource]);
        }
        setResource({
            firstName: '',
            lastName: '',
            skillId: '',
            levelOfExpertise: 'junior',
            project: '',
            yearsAtNatterbox: '',
            endDate: '' // Reset endDate field
        });
    }

    async function deleteResource(id) {
        await fetch('/api/resources', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        setResources(resources.filter(resource => resource.id !== id));
    }

    function editResource(id) {
        const resource = resources.find(resource => resource.id === id);
        setResource({
            firstName: resource.firstName,
            lastName: resource.lastName,
            skillId: resource.skillId,
            levelOfExpertise: resource.levelOfExpertise,
            project: resource.project,
            yearsAtNatterbox: resource.yearsAtNatterbox,
            endDate: resource.endDate ? new Date(resource.endDate).toISOString().split('T')[0] : '' // Format endDate
        });
        setIsEditing(true);
        setEditResourceId(id);
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Resources</h1>
            <form className="mb-6 grid grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md"
                  style={{width: '60%', margin: '0'}}>
                <input
                    type="text"
                    value={resource.firstName}
                    onChange={(e) => setResource({...resource, firstName: e.target.value})}
                    className="mb-2 px-4 py-2 border rounded w-full"
                    placeholder="First Name"
                />
                <input
                    type="text"
                    value={resource.lastName}
                    onChange={(e) => setResource({...resource, lastName: e.target.value})}
                    className="mb-2 px-4 py-2 border rounded w-full"
                    placeholder="Last Name"
                />
                <select
                    value={resource.skillId}
                    onChange={(e) => setResource({...resource, skillId: e.target.value})}
                    className="mb-2 px-4 py-2 border rounded w-full"
                >
                    <option value="">Select Skill</option>
                    {skills.map(skill => (
                        <option key={skill.id} value={skill.id}>{skill.skillName}</option>
                    ))}
                </select>
                <select
                    value={resource.levelOfExpertise}
                    onChange={(e) => setResource({...resource, levelOfExpertise: e.target.value})}
                    className="mb-2 px-4 py-2 border rounded w-full"
                >
                    <option value="junior">Junior</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="senior">Senior</option>
                </select>
                <input
                    type="number"
                    value={resource.yearsAtNatterbox}
                    onChange={(e) => setResource({...resource, yearsAtNatterbox: e.target.value})}
                    className="mb-2 px-4 py-2 border rounded w-full"
                    placeholder="Years at Natterbox"
                />
                <input
                    type="text"
                    value={resource.project}
                    onChange={(e) => setResource({...resource, project: e.target.value})}
                    className="mb-2 px-4 py-2 border rounded w-full"
                    placeholder="Current Project"
                />
                <input
                    type="date"
                    value={resource.endDate}
                    onChange={(e) => setResource({...resource, endDate: e.target.value})}
                    className="mb-2 px-4 py-2 border rounded col-span-2 w-full"
                    placeholder="End Date"
                />
                <button
                    type="button"
                    onClick={handleResource}
                    className={`px-4 py-2 ${isEditing ? 'bg-yellow-500' : 'bg-blue-500'} text-white rounded hover:${isEditing ? 'bg-yellow-700' : 'bg-blue-700'} col-span-2 w-full`}
                >
                    {isEditing ? 'Edit Resource' : 'Add Resource'}
                </button>
            </form>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mt-10">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b text-left bg-gray-200">First Name</th>
                    <th className="py-2 px-4 border-b text-left bg-gray-200">Last Name</th>
                    <th className="py-2 px-4 border-b text-left bg-gray-200">Skill</th>
                    <th className="py-2 px-4 border-b text-left bg-gray-200">Level of Expertise</th>
                    <th className="py-2 px-4 border-b text-left bg-gray-200">Years at Natterbox</th>
                    <th className="py-2 px-4 border-b text-left bg-gray-200">Current Project</th>
                    <th className="py-2 px-4 border-b text-left bg-gray-200">End Date</th>
                    <th className="py-2 px-4 border-b text-left bg-gray-200">Actions</th>
                </tr>
                </thead>
                <tbody>
                {resources.map(resource => (
                    <tr key={resource.id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b text-left">{resource.firstName}</td>
                        <td className="py-2 px-4 border-b text-left">{resource.lastName}</td>
                        <td className="py-2 px-4 border-b text-left">{skills.find(skill => skill.id === resource.skillId)?.skillName}</td>
                        <td className="py-2 px-4 border-b text-left">{resource.levelOfExpertise}</td>
                        <td className="py-2 px-4 border-b text-left">{resource.yearsAtNatterbox}</td>
                        <td className="py-2 px-4 border-b text-left">{resource.project}</td>
                        <td className="py-2 px-4 border-b text-left">{new Date(resource.endDate).toLocaleDateString('en-GB')}</td>
                        <td className="py-2 px-4 border-b text-right">
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => deleteResource(resource.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => editResource(resource.id)}
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
