const API_URL = "https://shfe-diplom.neto-server.ru";

export async function getAllData() {
  const res = await fetch(`${API_URL}/alldata`);
  if (!res.ok) {
    throw new Error("Ошибка при получении данных");
  }
  const data = await res.json();
  return data.result;
}