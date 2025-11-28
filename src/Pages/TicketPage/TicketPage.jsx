import Header from "../../Components/Header";
import { useParams } from "react-router-dom";
import { useAdminData } from "../../Api/AdminDataProvider";
import { useSelectedSeats } from "../../Api/SelectedSeatsContext";
import { useEffect, useRef, useState } from "react";
import { buyTicket } from "../../Api/buyTicket";
import QRcode from "../../Components/QRcode";

export default function TicketPage() {
    const { seanceId } = useParams();
    const { seances, films, halls } = useAdminData();
    const { selectedSeats } = useSelectedSeats();
    const [ticketData, setTicketData] = useState(null);
    const hasRequestedRef = useRef(false);

    if (!seances.length || !films.length || !halls.length) {
        return <p>Загрузка...</p>;
    }

    const seance = seances.find(s => s.id === Number(seanceId));
    const film = seance ? films.find(f => f.id === seance.seance_filmid) : null;
    const hall = seance ? halls.find(h => h.id === seance.seance_hallid) : null;

    useEffect(() => {
        if (!seance || !hall || selectedSeats.length === 0) return;
        if (hasRequestedRef.current) return;

        hasRequestedRef.current = true;

        async function purchase() {
            const tickets = selectedSeats.map(s => ({
                row: s.row + 1,
                place: s.seat + 1,
                coast: s.type === "vip"
                ? Number(hall.hall_price_vip)
                : Number(hall.hall_price_standart)
            }));

            const date = new Date().toISOString().split("T")[0];
            const resultTickets = await buyTicket(seance.id, date, tickets);

            if (resultTickets) {
                setTicketData({
                    tickets: resultTickets,
                    date: date
                });;
            }
        }

        purchase();
    }, [seance, hall, selectedSeats]);

    const totalPrice = selectedSeats.reduce((sum, s) => {
        const price =
            s.type === "vip"
                ? Number(hall.hall_price_vip)
                : Number(hall.hall_price_standart);
        return sum + price;
    }, 0);

    const qrValue = JSON.stringify({
        Фильм: film.film_name,
        Дата: ticketData?.date,
        Время: seance.seance_time,
        Зал: hall.hall_name,
        Ряд: selectedSeats[0].row + 1,
        Место: selectedSeats.map(s => s.seat + 1).join(", "),
        Цена: totalPrice,
        Важно: "Билет действителен строго на свой сеанс"
    });
    
    if (!seance || !film || !hall) return <p>Загрузка...</p>;

    return (
        <div className="wrap">
            <Header />
            <div className="payment">
                <div className="payment-main">
                    <div className="payment-main__header cut-line">
                        <p className="payment-main__header-info">Электронный билет</p>
                    </div>
                    <div className="payment-main__ticket cut-line">
                        <div className="payment-main__ticket-info">
                            <p className="ticket-info">На фильм: <strong>{film?.film_name}</strong></p>
                            <p className="ticket-info">Места: <strong>
                                {selectedSeats
                                .map(s => `${s.row + 1} ряд, ${s.seat + 1} место`)
                                .join("; ")}</strong></p>
                            <p className="ticket-info">В зале: <strong>{hall?.hall_name}</strong></p>
                            <p className="ticket-info">Начало сеанса: <strong>{seance.seance_time}</strong></p>
                            <div className="qr-code">
                                <QRcode value={qrValue} size={200} />
                            </div>
                            <p className="ticket-add-info">Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
                            <p className="ticket-add-info">Приятного просмотра!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}