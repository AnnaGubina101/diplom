export default function Header() {
    const handleHeaderClick = () => {
        window.location.reload(); 
    };

    return (
         <div className='header'>
            <h1 className='header-main' onClick={handleHeaderClick}>
                Идем<span className='header__letter'>В</span>Кино
            </h1>
        </div>
    );
}