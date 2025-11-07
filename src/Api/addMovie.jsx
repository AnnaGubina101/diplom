export async function addMovie({ filmName, filmDuration, filmDescription, filmOrigin, filePoster }) {
    const formData = new FormData();
    formData.set("filmName", filmName);
    formData.set("filmDuration", filmDuration);
    formData.set("filmDescription", filmDescription);
    formData.set("filmOrigin", filmOrigin);
    formData.set("filePoster", filePoster);

    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    const response = await fetch("https://shfe-diplom.neto-server.ru/film", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Ошибка при добавлении фильма");
    }
  
    const data = await response.json();
    return data;
}