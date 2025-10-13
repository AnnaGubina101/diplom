export async function addHall(hallName) {
  const params = new FormData();
  params.set("hallName", hallName);

  const response = await fetch("https://shfe-diplom.neto-server.ru/hall", {
    method: "POST",
    body: params,
  });

  if (!response.ok) {
    throw new Error("Ошибка при добавлении зала");
  }

  const data = await response.json();
  return data;
}