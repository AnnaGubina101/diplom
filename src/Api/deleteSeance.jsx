export default async function deleteSeance(seanceId) {
  const response = await fetch(`https://shfe-diplom.neto-server.ru/seance/${seanceId}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Ошибка при удалении сеанса");
  }

  const data = await response.json();
  return data;
}