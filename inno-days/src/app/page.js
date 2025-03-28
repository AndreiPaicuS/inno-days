"use client"

import Tabs from './components/Tabs';
import Skills from './components/Skills';
import Resources from './components/Resources';
import {useEffect} from "react";

export default function Home() {
    useEffect(() => {
        async function fetchGithubData() {
            await fetch('/api/githubData');
        }

        fetchGithubData();
    }, []);


    return (
        <div className="p-4">
            <Tabs tabs={['Skills', 'Resources']}>
                <Skills />
                <Resources />
            </Tabs>
        </div>
    );
}
