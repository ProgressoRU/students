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
            26: ['success', '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Группа создана!']
        });
})();