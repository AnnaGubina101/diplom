export async function addSeance({ seanceHallid, seanceFilmid, seanceTime }) {
  const formData = new FormData();
  formData.set("seanceHallid", seanceHallid);
  formData.set("seanceFilmid", seanceFilmid);
  formData.set("seanceTime", seanceTime);

  const response = await fetch("https://shfe-diplom.neto-server.ru/seance", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Ошибка при добавлении сеанса");
  }

  const data = await response.json();
  return data;
}