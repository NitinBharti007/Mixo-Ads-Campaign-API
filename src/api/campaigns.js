import { client } from './client.js';

export async function listCampaigns(signal) {
  const response = await client.get('/campaigns', { signal });
  return response;
}

export async function getCampaign(id, signal) {
  const response = await client.get(`/campaigns/${id}`, { signal });
  return response;
}

export async function getAggregateInsights(signal) {
  const response = await client.get('/campaigns/insights', { signal });
  return response;
}

export async function getCampaignInsights(id, signal) {
  const response = await client.get(`/campaigns/${id}/insights`, { signal });
  return response;
}