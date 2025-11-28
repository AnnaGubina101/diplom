export async function openHallSales(hallId, hallOpen) {
    const params = new FormData();
    params.set("hallOpen", String(hallOpen ? 1 : 0));

    const response = await fetch(`https://shfe-diplom.neto-server.ru/open/${hallId}`, {
        method: "POST",
        body: params,
    });

    return response.json();
}