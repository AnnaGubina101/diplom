export default async function login(email, password) {
    const formData = new FormData();
    formData.append('login', email);
    formData.append('password', password);

    try {
        const response = await fetch(`https://shfe-diplom.neto-server.ru/login`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();

        if (data.success) {
            console.log('Авторизация успешна!', data.result);
            return data.result;
        } else {
            console.error('Ошибка авторизации:', data.error);
        }
    } catch(err) {
        console.error('Ошибка авторизации:', err);
    }
}