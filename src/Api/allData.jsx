export async function getAllData() {
  const res = await fetch("https://shfe-diplom.neto-server.ru/alldata");
  if (!res.ok) {
    throw new Error("Ошибка при получении данных");
  }
  const data = await res.json();
  return data.result;
}