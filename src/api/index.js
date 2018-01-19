import axios from 'axios'
import CONFIG from '../assets/config.js'

export const getIssuesForRepo = (owner, repo, page = 1, per_page = 20) => {
  return axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?page=${page}&per_page=${per_page}`)
}

export const getSingleIssue = (owner, repo, number) => {
  return axios.get(`https://api.github.com/repos/${owner}/${repo}/issues/${number}`);
}

export const fetchIssuesForLabel = (label, page = 1, per_page = 20) => {
  return axios.get(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/issues?page=${page}&per_page=${per_page}&labels=${label}`);
}

export const getLabels = () => {
  return axios.get(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/labels`);
}
