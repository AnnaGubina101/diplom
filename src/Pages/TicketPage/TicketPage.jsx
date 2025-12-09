import Header from "../../Components/Header";
import { useParams, useLocation } from "react-router-dom";
import { useAdminData } from "../../Api/AdminDataProvider";
import { useSelectedSeats } from "../../Api/SelectedSeatsContext";
import { useEffect, useRef, useState } from "react";
import { buyTicket } from "../../Api/buyTicket";
import QRcode from "../../Components/QRcode";

const getDisplayRow = (seat) => {
    if (seat.ticket_row !== undefined) {
        return seat.ticket_row;
    }
    return seat.row + 1;
};

const getDisplayPlace = (seat) => {
    if (seat.ticket_place !== undefined) {
        return seat.ticket_place;
    }
    return seat.seat + 1; 
};

export default function TicketPage() {
    // const { seanceId } = useParams();
    // const location = useLocation();
    // const { seances, films, halls, reload } = useAdminData();
    // const { selectedSeats, clearSelectedSeats } = useSelectedSeats();
    // const [ticketData, setTicketData] = useState(null);
    // const hasRequestedRef = useRef(false);

    // const ticketDate = location.state?.date || new Date().toISOString().split("T")[0];

    // if (!seances.length || !films.length || !halls.length) {
    //     return <p>Загрузка...</p>;
    // }

    // const seance = seances.find(s => s.id === Number(seanceId));
    // const film = seance ? films.find(f => f.id === seance.seance_filmid) : null;
    // const hall = seance ? halls.find(h => h.id === seance.seance_hallid) : null;

    // useEffect(() => {
    //     if (!seance || !hall || selectedSeats.length === 0) return;
    //     if (hasRequestedRef.current) return;

    //     hasRequestedRef.current = true;

    //     async function purchase() {
    //         const tickets = selectedSeats.map(s => ({
    //             row: s.row + 1,
    //             place: s.seat + 1,
    //             coast: s.type === "vip"
    //             ? Number(hall.hall_price_vip)
    //             : Number(hall.hall_price_standart)
    //         }));

    //         const resultTickets = await buyTicket(seance.id, ticketDate, tickets);

    //         if (resultTickets) {
    //             setTicketData({
    //                 tickets: resultTickets,
    //                 date: ticketDate
    //             });
    //             clearSelectedSeats();
    //             await reload(); 
    //         }
    //     }

    //     purchase();
    // }, [seance, hall, selectedSeats, ticketDate, clearSelectedSeats, reload]);

    // const displaySeats = ticketData ? ticketData.tickets : selectedSeats;

    //    if (displaySeats.length === 0) {
    //     if (!ticketData) {
    //          return <p>Ошибка: места не выбраны или данные не загружены.</p>;
    //     }
    // }

    // const totalPrice = displaySeats.reduce((sum, s) => {
    //     if (s.ticket_price !== undefined) {
    //         return sum + Number(s.ticket_price);
    //     }

    //     const price =
    //         s.type === "vip"
    //             ? Number(hall.hall_price_vip)
    //             : Number(hall.hall_price_standart);
    //     return sum + price;
    // }, 0);

    // const qrValue = JSON.stringify({
    //     Фильм: film.film_name,
    //     Дата: ticketData?.date || ticketDate,
    //     Время: seance.seance_time,
    //     Зал: hall.hall_name,
    //     Ряд: getDisplayRow(displaySeats[0]),
    //     Место: displaySeats.map(s => getDisplayPlace(s)).join(", "),
    //     Цена: totalPrice,
    //     Важно: "Билет действителен строго на свой сеанс"
    // });
    
    // if (!seance || !film || !hall) return <p>Загрузка...</p>;

    const { seanceId: paramsSeanceId } = useParams();
  const { state } = useLocation();
  const { seances, films, halls, reload } = useAdminData();
  const { clearSelectedSeats } = useSelectedSeats();
  const [ticketData, setTicketData] = useState(null);
  const hasRequestedRef = useRef(false);

  if (!state) {
    return <p>Ошибка: данные о бронировании не найдены. Вернитесь к оплате.</p>;
  }

  const {
    date: stateDate,
    seanceId = paramsSeanceId,
    filmName: stateFilmName,
    hallName: stateHallName,
    time: stateTime,
    seats = [],
    prices,
    total: stateTotal,
  } = state;

  const ticketDate = stateDate || new Date().toISOString().split("T")[0];

  if (!seances.length || !films.length || !halls.length) {
    return <p>Загрузка...</p>;
  }

  const seance = seances.find((s) => s.id === Number(seanceId));
  const film = seance
    ? films.find((f) => f.id === seance.seance_filmid)
    : null;
  const hall = seance
    ? halls.find((h) => h.id === seance.seance_hallid)
    : null;

  useEffect(() => {
    if (!seance || !hall || seats.length === 0) return;
    if (hasRequestedRef.current) return;

    hasRequestedRef.current = true;

    async function purchase() {
      try {
        const tickets = seats.map((s) => ({
          row: s.row + 1,
          place: s.seat + 1,
          coast:
            s.type === "vip"
              ? Number(prices?.vip ?? prices?.standard ?? hall.hall_price_vip)
              : Number(prices?.standard ?? hall.hall_price_standart),
        }));

        const resultTickets = await buyTicket(seance.id, ticketDate, tickets);

        if (resultTickets) {
          setTicketData({
            tickets: resultTickets,
            date: ticketDate,
          });
          clearSelectedSeats(); // на всякий случай почистим контекст
          await reload();
        }
      } catch (e) {
        console.error("Ошибка при покупке билета", e);
      }
    }

    purchase();
  }, [seance, hall, seats, ticketDate, prices, clearSelectedSeats, reload]);

  const displaySeats = ticketData ? ticketData.tickets : seats;

  if (!displaySeats || displaySeats.length === 0) {
    if (!ticketData) {
      return <p>Ошибка: места не выбраны или данные не загружены.</p>;
    }
  }

  const totalPrice = ticketData
    ? displaySeats.reduce(
        (sum, s) => sum + Number(s.ticket_price || 0),
        0
      )
    : stateTotal ??
      displaySeats.reduce((sum, s) => {
        const price =
          s.type === "vip"
            ? Number(prices?.vip ?? hall.hall_price_vip)
            : Number(prices?.standard ?? hall.hall_price_standart);
        return sum + price;
      }, 0);

  const qrValue = JSON.stringify({
    Фильм: stateFilmName || film?.film_name,
    Дата: ticketData?.date || ticketDate,
    Время: stateTime || seance?.seance_time,
    Зал: stateHallName || hall?.hall_name,
    Ряд: getDisplayRow(displaySeats[0]),
    Место: displaySeats.map((s) => getDisplayPlace(s)).join(", "),
    Цена: totalPrice,
    Важно: "Билет действителен строго на свой сеанс",
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
                            {/* <p className="ticket-info">На фильм: <strong>{film?.film_name}</strong></p>
                            <p className="ticket-info">Места: <strong>
                                {displaySeats
                                .map(s => `${getDisplayRow(s)} ряд, ${getDisplayPlace(s)} место`)
                                .join("; ")}</strong></p>
                            <p className="ticket-info">В зале: <strong>{hall?.hall_name}</strong></p>
                            <p className="ticket-info">Начало сеанса: <strong>{seance.seance_time}</strong></p>
                            <div className="qr-code">
                                <QRcode value={qrValue} size={200} />
                            </div> */}
                            <p className="ticket-info">
                На фильм: <strong>{stateFilmName || film.film_name}</strong>
              </p>
              <p className="ticket-info">
                Места:{" "}
                <strong>
                  {displaySeats
                    .map(
                      (s) =>
                        `${getDisplayRow(s)} ряд, ${getDisplayPlace(s)} место`
                    )
                    .join("; ")}
                </strong>
              </p>
              <p className="ticket-info">
                В зале: <strong>{stateHallName || hall.hall_name}</strong>
              </p>
              <p className="ticket-info">
                Начало сеанса:{" "}
                <strong>{stateTime || seance.seance_time}</strong>
              </p>
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