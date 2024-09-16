export async function getLocalIp(){
  const response = await fetch('https://api.ipify.org?format=json');
  if(response.ok){
      const data = await response.json();
      return data.ip;
  }
  return null;
}