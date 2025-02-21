import { useState } from 'react';

export default function Tabs({ tabs, children }) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="flex border-b">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 ${activeTab === index ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="p-4">
                {children[activeTab]}
            </div>
        </div>
    );
}
