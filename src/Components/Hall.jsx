export default function Hall(props) {

    return (
        <>
            <div className="buying-info">
                    <strong className="name">{props.title}</strong>
                    <span className="time">Начало сеанса: {}</span>
                    <strong className="hall">Зал {}</strong>
            </div>
        </>
    )
}