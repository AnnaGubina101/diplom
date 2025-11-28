export default function Hall({ title, time, hallName }) {
    return (
        <div className="buying-info-wrap">
            <div className="buying-info">
                <strong className="name">{title}</strong>
                <span className="time">Начало сеанса: {time}</span>
                <strong className="hall">{hallName}</strong>
            </div>
            <div className="buying-info-hint">
                <p>Тапните дважды, чтобы увеличить</p>
            </div>
        </div>
    );
}