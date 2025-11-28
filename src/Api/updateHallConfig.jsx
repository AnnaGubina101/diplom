export async function updateHallConfig(hallId, rowCount, placeCount, config) {
  const params = new FormData();
  params.set('rowCount', String(rowCount));
  params.set('placeCount', String(placeCount));
  params.set('config', JSON.stringify(config));

  const response = await fetch(`https://shfe-diplom.neto-server.ru/hall/${hallId}`, {
    method: 'POST',
    body: params,
  });

  const data = await response.json();
  return data;
}