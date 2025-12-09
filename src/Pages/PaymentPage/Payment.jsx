import Button from "../../Components/Button"
import { useAdminData } from "../../Api/AdminDataProvider";
import { useSelectedSeats } from "../../Api/SelectedSeatsContext";
import Header from "../../Components/Header";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const { seanceId } = useParams();
  const { seances, films, halls } = useAdminData();
  const { selectedSeats } = useSelectedSeats();
  const { state } = useLocation();
  const date = state?.date || new Date().toISOString().split("T")[0];

  const seance = seances.find(s => s.id === Number(seanceId));
  if (!seance) return <p>Загрузка...</p>;

  const film = films.find(f => f.id === seance.seance_filmid);
  const hall = halls.find(h => h.id === seance.seance_hallid);

  const total = selectedSeats.reduce((sum, seat) => {
        return sum + (seat.type === "vip" 
            ? hall.hall_price_vip 
            : hall.hall_price_standart
        );
  }, 0);

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
                  <p className="ticket-info">На фильм: <strong>{film?.film_name}</strong></p>
                  <p className="ticket-info">Места: <strong>
                    {selectedSeats
                    .map(s => `${s.row + 1} ряд, ${s.seat + 1} место`)
                    .join("; ")}</strong></p>
                  <p className="ticket-info">В зале: <strong>{hall?.hall_name}</strong></p>
                  <p className="ticket-info">Начало сеанса: <strong>{seance.seance_time}</strong></p>
                  <p className="ticket-info">Стоимость: <strong>{total} руб.</strong></p>
                  <Button className="payment-main-btn" onClick={() => navigate(`/ticket/${seance.id}`, {state: { date }})}>Получить код бронирования</Button>
                  <p className="ticket-add-info">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</p>
                  <p className="ticket-add-info">Приятного просмотра!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}