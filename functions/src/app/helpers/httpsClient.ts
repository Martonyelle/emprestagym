import fetch from 'node-fetch';

export const request = async (url: string, options: any) => {
  const response = await fetch(url, options);
  const data = await response.json();
  return { status: response.status, data };
};

export const requestBuffer = async (url: string, options: any) => {
  const response = await fetch(url, options);
  const buffer = await response.buffer();
  return { status: response.status, data: buffer };
};