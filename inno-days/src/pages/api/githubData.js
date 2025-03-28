const axios = require('axios');
const cron = require('node-cron');
import { extractNextLink } from '@/utils/githubUtils';
import { addSkill} from "@/utils/skillsUtils";

const GITHUB_TOKEN = 'xxxx';
const ORG_NAME = 'redmatter';

const link = `https://api.github.com/orgs/${ORG_NAME}/repos?per_page=100`;

const fetchRepos = async () => {
    try {
        const repos = [];
        let response = null;
        let linkToFetch = link;
        const reposToFetch = 30;

        do {
            if (response !== null) linkToFetch = extractNextLink(response.headers.link);

            console.log('Fetching link:', linkToFetch);
            response = await axios.get(linkToFetch, {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json"
                }
            });

            const privateRepos = response.data.filter(repo => repo.private);

            repos.push(...privateRepos);
        } while (extractNextLink(response.headers.link) && repos.length < reposToFetch);

        return repos;
    } catch (error) {
        console.error('Error fetching repositories:', error.response?.data || error.message);
        return [];
    }
};

const fetchRepoLanguages = async (repoName) => {
    try {
        const languagesResponse = await axios.get(`https://api.github.com/repos/${ORG_NAME}/${repoName}/languages`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        return languagesResponse.data;
    } catch (error) {
        console.error(`Error fetching languages for repo ${repoName}:`, error);
        return {};
    }
};

const fetchRepoContributors = async (repoName) => {
    try {
        const contributorsResponse = await axios.get(`https://api.github.com/repos/${ORG_NAME}/${repoName}/contributors`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        return contributorsResponse.data;
    } catch (error) {
        console.error(`Error fetching contributors for repo ${repoName}:`, error);
        return [];
    }
};

const fetchSkillsData = async () => {
    const repos = await fetchRepos();
    console.log(`Repos in ${ORG_NAME}: `, repos.length);

    for (const repo of repos) {
        // Add skills to the database

        if (repo.language) {
            await addSkill(repo.language);
        } else {
            const languages = await fetchRepoLanguages(repo.name);
            if(Object.entries(languages).length) {
                const mostUsedLanguage = Object.entries(languages)
                    .reduce((max, curr) => (curr[1] > max[1] ? curr : max));
                await addSkill(mostUsedLanguage[0]);
                repo.language = mostUsedLanguage[0];
            }
        }

        repo.contributors = await fetchRepoContributors(repo.name);
        // console.log('Languages:', languages);
        // console.log('Contributors:', contributors);
    }

    return repos;
};

const initializeCronJob = async () => {
    // Schedule the task to run every day at midnight
    cron.schedule('0 0 * * *', fetchSkillsData);

    // Run the fetchData function immediately
    return fetchSkillsData();
};

export default async function handler(req, res) {
    const data = await initializeCronJob();
    res.status(200).json({ message: 'GitHub data fetching initialized', data });
};
