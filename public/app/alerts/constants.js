(function () {
    'use strict';
    angular
        .module('alerts')
        .constant('events', {
            0: ['danger', 'Сервер не прислал ответ. Обратитесь к администратору'],
            //Network
            400: ['danger', '400: Ошибка в запросе'],
            401: ['danger', '401: Необходимо авторизоваться'],
            403: ['danger', '403: Запрещено.'],
            404: ['danger', '404: Не найдено'],
            500: ['danger', '500: Внутренняя ошибка сервера. Обратитесь к администратору.'],
            //Editor (1x)
            10: ['success', '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Успешно сохранено!'],
            11: ['danger', 'Материал должен содержать заголовок и текст'],
            12: ['danger', 'Заголовок должен содержать более 3, но менее 100 символов'],
            13: ['success', '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Материал удален'],
            14: ['danger', 'Все поля должны быть заполнены'],
            15: ['danger', 'Описание должно содержать более 3, но менее 255 символов'],
            //Groups (2x)
            20: ['danger', 'Кодовое слово не подходит.'],
            21: ['danger', 'Введите название группы и ключевое слово'],
            22: ['danger', 'Кодовое слово уже используется. Попробуйте изменить его.'],
            23: ['danger', 'Кодовое слово должно содержать не менее 3 символов и быть уникальным.'],
            24: ['danger', 'Введите кодовое слово'],
            25: ["danger", "Кодовое слово устарело. Обратитесь за новым к преподавателю."],
            26: ['success', '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Группа создана!'],
            27: ["danger", "Вы уже подписаны на эту группу."],
            28: ["danger", "Вы не можете подписаться на группу, изучающую предметы на которые вы уже подписаны."],
            29: ["success", "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> Подписка оформлена"],
            99: ["success", "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> Группа удалена. Сейчас вы будете перенаправлены на главную страницу."],
            98: ["success", "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> Пользователь удален из группы"],
            //Registration and Auth (3x-4x)
            30: ["success", '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Регистрация завершена'],
            31: ["danger", "Имя пользователя должно содержать более 3, но менее 16 символов"],
            32: ["danger", "Пароль должен содержать более 6 символов."],
            33: ["danger", "Не указано кодовое слово"],
            34: ["danger", "Не указана группа"],
            35: ["danger", "Срок действия кодового слова истек. Обратитесь к учителю"],
            36: ["danger", "Кодовое слово не подходит."],
            37: ["danger", "Имя уже занято"],
            38: ["danger", "Возникла ошибка. Обратитесь к администратору."], //не может возникнуть?
            39: ["danger", "Укажите имя и фамилию"],
            40: ["success", '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Вход выполнен'],
            41: ["danger", "Имя и/или пароль введены неверно."],
            42: ["danger", "Недостаточно прав"],
            43: ["success", "Права пользователя изменены"],
            44: ["warning", 'Ваша сессия завершена. Авторизуйтесь, чтобы продолжить работу.'],
            //Disciplines (5x-6x)
            51: ["danger", "Заголовок должен содержать более 3, но менее 64 символов"],
            52: ["danger", "Описание должно содержать менее 144 символов"],
            53: ["success", '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Курс создан']
        });
})();