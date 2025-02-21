"use client"

import Tabs from './components/Tabs';
import Skills from './components/Skills';
import Resources from './components/Resources';

export default function Home() {
    return (
        <div className="p-4">
            <Tabs tabs={['Skills', 'Resources']}>
                <Skills />
                <Resources />
            </Tabs>
        </div>
    );
}
