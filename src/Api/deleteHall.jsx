export default async function deleteHall(hallId) {
  const response = await fetch(`https://shfe-diplom.neto-server.ru/hall/${hallId}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Ошибка при удалении зала");
  }

  const data = await response.json();
  return data;
}