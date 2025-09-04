export default function Button({ children }) {
    const handleBuyClick = () => {
        
    }

    return(
        <button className="button" onClick={handleBuyClick}>{children}</button>
    )
}