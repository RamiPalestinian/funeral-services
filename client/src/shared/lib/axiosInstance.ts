import axios from 'axios';

// Создаём свой экземпляр axios
export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/api', // тащим наш локал хост из .env
    headers: {"Content-Type" : 'application/json'}, // то что у нас могут быть json файлы
    withCredentials: true, //к каждому запросу прикладываем куки
});

let accessToken = '';  //создаем новый токен

// Функция для установки нового accessToken;
export function setAccessToken (newToken: string) { //функция создания нового токена
    accessToken = newToken;  // прокидываем в созданный токен,токен который передаем
}

// Интерцептор - функция для перехвата и изменения запросов и ответов
// Добавляем accessToken в заголовок запроса Authorization , config- доккументация в виде аргумента
axiosInstance.interceptors.request.use((config) => { // перехватываем наши запросы, interceptors- функции которые перехватывают запросы
if (accessToken && !config.headers.Authorization) { // если есть accessToken и в конфиге нашего запроса нет заголовка Authorization
    config.headers.Authorization = `Bearer ${accessToken}`; // тогда добавляем в ручную, Bearer-носитель токена
  }
  return config; // вытаскиваем нашу доккументацию,которую передали
});

// Если получили статус 403 в ответе - пробуем обновить наши токены 1 раз и повторить запрос
axiosInstance.interceptors.response.use(    // перехватываем наши запответы котовые присылает сервер
    (response) => response, // если получили нормальный ответ(правильный) то мы его сразу и возвращаем
    // если какая-то ошибка
    async (error) => {
      const previousRequest = error.config; // сохраняем конфигурацию ошибки которую нам передал сервер
  
      if (error.response?.status === 403 && !previousRequest.sent) { // 403 - невалидный accessToken && не пробовали повторно отправить запрос
        previousRequest.sent = true; // устанавливаем флажок,что мы попробуем еще ОДИН раз жто сделать

        try {
          const { data } = await axiosInstance.post('/auth/refresh'); //отправляем запрос на наш путь http://localhost:3000/api/auth/refresh что бы обновить токен accessToken
          const newToken = data.accessToken; // достаем из ответа новый токен accessToken
          setAccessToken(newToken);
          previousRequest.headers.Authorization = `Bearer ${accessToken}`; // к нашему предыдущему запросу который получил ошибку 403(33) устанавливаем заголовок авторизации (как в 19)
          return axiosInstance(previousRequest); // и опять запускаем через axiosInstance наш запрос что бы обновить наш accessToken если не удачно то в catch(переходит на страницу авторизации)
        } catch (error) {
          setAccessToken('');
          window.location.href = '/auth';
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    },
);
