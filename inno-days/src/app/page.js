"use client";

import { useEffect, useState } from "react";
import Tabs from "./components/Tabs";
import Skills from "./components/Skills";
import Resources from "./components/Resources";
import AICenter from "./components/AICenter";

export default function Home() {
  const [jiraData, setJiraData] = useState(null);

  useEffect(() => {
    const fetchJiraData = async () => {
      const token = "TOKEN";
      const issueKey = "DEMO-1"; // Replace with your specific issue key
      const url = `https://natterbox.atlassian.net/rest/api/3/issue/${issueKey}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(`email@example.com:${token}`)}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setJiraData(data);
      } catch (error) {
        console.error("Failed to fetch Jira data:", error);
      }
    };

    fetchJiraData();
  }, []);

  useEffect(() => {
    console.log("Jira data:", jiraData);
  }, [jiraData]);

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Innovation Days
        </h1>
        <Tabs tabs={["Skills", "Resources", "AI Center"]}>
          <Skills />
          <Resources />
          <AICenter />
        </Tabs>
        {jiraData && (
          <div className="mt-4">
            <h2 className="text-xl font-bold">Jira Data:</h2>
            <pre className="bg-gray-200 p-4 rounded">
              {JSON.stringify(jiraData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
