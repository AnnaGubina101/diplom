import Button from "../../Components/Button"
import { useAdminData } from "../../Api/AdminDataProvider";
import { useSelectedSeats } from "../../Api/SelectedSeatsContext";
import Header from "../../Components/Header";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function Payment() {
  // const navigate = useNavigate();
  // const { seanceId } = useParams();
  // const { seances, films, halls } = useAdminData();
  // const { selectedSeats } = useSelectedSeats();
  // const { state } = useLocation();
  // const date = state?.date || new Date().toISOString().split("T")[0];

  const navigate = useNavigate();
  const { seanceId: paramSeanceId } = useParams();
  const { state } = useLocation();

  if (!state) {
    return <p>Ошибка: данные о бронировании не найдены. Вернитесь к выбору мест.</p>;
  }

  const {
    date,
    seanceId = paramSeanceId,
    filmName,
    hallName,
    time,
    seats = [],
    prices,
  } = state;

  if (!seanceId || !filmName || !hallName || !time || !prices) {
    return <p>Ошибка: некорректные данные о сеансе.</p>;
  }

  // const seance = seances.find(s => s.id === Number(seanceId));
  // if (!seance) return <p>Загрузка...</p>;

  // const film = films.find(f => f.id === seance.seance_filmid);
  // const hall = halls.find(h => h.id === seance.seance_hallid);

  // const total = selectedSeats.reduce((sum, seat) => {
  //       return sum + (seat.type === "vip" 
  //           ? hall.hall_price_vip 
  //           : hall.hall_price_standart
  //       );
  // }, 0);

  const total = seats.reduce((sum, seat) => {
    const price =
      seat.type === "vip"
        ? Number(prices.vip ?? prices.standard)
        : Number(prices.standard);
    return sum + price;
  }, 0);

  const placesText =
    seats.length > 0
      ? seats
          .map((s) => `${s.row + 1} ряд, ${s.seat + 1} место`)
          .join("; ")
      : "места не выбраны";

  const handleGetCode = () => {
    navigate(`/ticket/${seanceId}`, {
      state: {
        date,
        seanceId,
        filmName,
        hallName,
        time,
        seats,
        prices,
        total,
      },
    });
  };


    return (
      <div className="wrap">
        <Header />
        <div className="payment">
          <div className="payment-main">
            <div className="payment-main__header cut-line">
              <p className="payment-main__header-info">Вы выбрали билеты:</p>
            </div>
            <div className="payment-main__ticket cut-line">
              <div className="payment-main__ticket-info">
                  {/* <p className="ticket-info">На фильм: <strong>{film?.film_name}</strong></p>
                  <p className="ticket-info">Места: <strong>
                    {selectedSeats
                    .map(s => `${s.row + 1} ряд, ${s.seat + 1} место`)
                    .join("; ")}</strong></p>
                  <p className="ticket-info">В зале: <strong>{hall?.hall_name}</strong></p>
                  <p className="ticket-info">Начало сеанса: <strong>{seance.seance_time}</strong></p>
                  <p className="ticket-info">Стоимость: <strong>{total} руб.</strong></p>
                  <Button className="payment-main-btn" onClick={() => navigate(`/ticket/${seance.id}`, {state: { date }})}>Получить код бронирования</Button> */}
                  <p className="ticket-info">
                На фильм: <strong>{filmName}</strong>
              </p>
              <p className="ticket-info">
                Места: <strong>{placesText}</strong>
              </p>
              <p className="ticket-info">
                В зале: <strong>{hallName}</strong>
              </p>
              <p className="ticket-info">
                Начало сеанса: <strong>{time}</strong>
              </p>
              <p className="ticket-info">
                Стоимость: <strong>{total} руб.</strong>
              </p>
              <Button
                className="payment-main-btn"
                onClick={handleGetCode}
                disabled={seats.length === 0}
              >
                Получить код бронирования
              </Button>
                  <p className="ticket-add-info">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</p>
                  <p className="ticket-add-info">Приятного просмотра!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}