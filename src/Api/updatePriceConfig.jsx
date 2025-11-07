export async function updatePriceConfig(hallId, priceStandart, priceVip) {
  const params = new FormData();
  params.set('priceStandart', priceStandart);
  params.set('priceVip', priceVip);

  const response = await fetch(`https://shfe-diplom.neto-server.ru/price/${hallId}`, {
    method: 'POST',
    body: params,
  });

  const data = await response.json();
  return data;
}