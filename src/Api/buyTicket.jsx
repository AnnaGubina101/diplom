export async function buyTicket(seanceId, ticketDate, tickets) {
  try {
    const formData = new FormData();
    formData.append("seanceId", seanceId);
    formData.append("ticketDate", ticketDate);
    formData.append("tickets", JSON.stringify(tickets));

    const response = await fetch("https://shfe-diplom.neto-server.ru/ticket", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!data.success) {
      console.error(" Ошибка покупки билета:", data.error);
      return null;
    }
    return data.result;
  } catch (error) {
    console.error(" Ошибка сети при покупке билета:", error);
    return null;
  }
}