(function () {
    'use strict';
    angular
        .module('alerts')
        .constant('events', {
            0: ['danger', 'Сервер не прислал ответ. Обратитесь к администратору'],
            //Network
            401: ['danger', '401: Необходимо авторизоваться'],
            403: ['danger', '403: Запрещено.'],
            500: ['danger', '500: Внутренняя ошибка сервера. Обратитесь к администратору.'],
            //Editor (1x)
            10: ['success', '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Успешно сохранено!'],
            11: ['danger', 'Материал должен содержать заголовок и текст'],
            12: ['danger', 'Заголовок должен содержать более 3, но менее 100 символов'],
            13: ['success', '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Материал удален'],
            //Groups
            21: ['danger', 'Не заполнены ключевые поля.'],
            22: ['danger', 'Кодовое слово уже используется. Попробуйте изменить его.'],
            26: ['success', '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Группа создана!'],
            //Registration and Auth (3x)
            30: ["success", '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Регистрация завершена'],
            31: ["danger", "Имя пользователя должно содержать более 3, но менее 16 символов"],
            32: ["danger", "Пароль должен содержать более 6 символов."],
            33: ["danger", "Не указано кодовое слово"],
            34: ["danger", "Не указана группа"],
            35: ["danger", "Срок действия кодового слова истек. Обратитесь к учителю"],
            36: ["danger", "Кодовое слово не подходит."],
            37: ["danger", "Имя уже занято"],
            38: ["danger", "Возникла ошибка. Обратитесь к администратору."],
            39: ["danger", "Укажите имя и фамилию"],
            40: ["success", '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Вход выполнен'],
            41: ["danger", "Имя и/или пароль введены неверно."]
        });
})();