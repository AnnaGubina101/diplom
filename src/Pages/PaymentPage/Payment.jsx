import Button from "../../Components/Button"

export default function Payment(props) {
    return (
        <div className="payment">
        <div className="payment-main">
          <div className="payment-main__header">
            <p className="payment-main__header-info">Вы выбрали билеты:</p>
          </div>
          <div className="payment-main__ticket">
            <div className="payment-main__ticket-info">
                <p className="ticket-info">На фильм: </p>
                <p className="ticket-info">Места: </p>
                <p className="ticket-info">В зале: </p>
                <p className="ticket-info">Начало сеанса: </p>
                <p className="ticket-info">Стоимость: </p>
                <Button className="payment-main-btn">Получить код бронирования</Button>
                <p className="ticket-add-info">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</p>
                <p className="ticket-add-info">Приятного просмотра!</p>
            </div>
          </div>
        </div>
      </div>
    )
}