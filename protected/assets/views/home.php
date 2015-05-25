<!DOCTYPE html>
<html lang="ru" data-ng-app="students" data-ng-cloak>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="/public/css/style.css">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.3.0/fullcalendar.min.css">
    <link rel="stylesheet" href="/public/css/textAngular.css">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="/public/css/loading-bar.css">
    <script data-require="jquery@2.1.3" data-semver="2.1.3" src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
    <script src="/public/lib/rangy/rangy-core.js"></script>
    <script src="/public/lib/rangy/rangy-selectionsaverestore.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-resource.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-route.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-animate.min.js"></script>
    <script src="http://code.angularjs.org/1.0.8/i18n/angular-locale_ru-ru.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
    <script src="/public/lib/bootstrap/ui-bootstrap-tpls-0.13.0.min.js"></script>
    <script src="//momentjs.com/downloads/moment-with-locales.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.3.0/fullcalendar.min.js"></script>
    <script src="/public/lib/angular/textAngular-sanitize.min.js"></script>
    <script src="/public/lib/angular/textAngular.min.js"></script>
    <script src="/public/lib/angular/calendar.js"></script>
    <script src="/public/lib/angular/loading-bar.js"></script>
    <script src="/public/app/students.module.js"></script>
    <script src="/public/app/controllers.js"></script>
    <script src="/public/app/directives.js"></script>
    <script src="/public/app/filters.js"></script>
    <script src="/public/app/layout/wrap.controller.js"></script>
    <script src="/public/app/shared/data.service.js"></script>
    <script src="/public/app/shared/auth.service.js"></script>
    <script src="/public/app/alerts/alerts.module.js"></script>
    <script src="/public/app/alerts/alerts.js"></script>
    <script src="/public/app/alerts/constants.js"></script>
    <script src="/public/app/shared/session.service.js"></script>
    <script src="/public/app/shared/authevents.constant.js"></script>
    <script src="/public/app/news/news.controller.js"></script>
    <script src="/public/app/editors/editor.module.js"></script>
    <script src="/public/app/editors/newsEditor.directive.js"></script>
</head>
<body data-ng-controller="WrapController as wrap">
<div class="modalAlert">
    <alert class="repeat-animation" ng-repeat="alert in wrap.alerts" type="{{alert.type}}"
           close="wrap.closeAlert($index)"><span
            data-ng-bind-html="alert.msg"></span></alert>
</div>
<div data-st-Header></div>
<div data-ng-view class="container-fluid"></div>
<div data-login-dialog></div>
<!--TODO: переместить модалы в отдельные вьюхи -->
<script type="text/ng-template" id="subscribeModal.html">
    <div class="modal-header">
        <h3 class="modal-title">Использовать кодовое слово</h3>
    </div>
    <div class="modal-body">
        <p>С помощью кодового слова вы можете подписаться на интересующий вас курс. Кодовое слово может выдать вам
            преподаватель.</p>

        <h3 class="text-center">Код:</h3>

        <p class="text-center"><input class="form-control input-lg" type="text" data-ng-model="passcode"></p>
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary" data-ng-click="ok()">OK</button>
        <button class="btn btn-warning" data-ng-click="cancel()">Отмена</button>
    </div>
</script>

<script type="text/ng-template" id="newGroupModal.html">
    <div class="modal-header">
        <h3 class="modal-title">Новая группа</h3>
    </div>
    <div class="modal-body">
        <div class="form-group">
            <label for="title">Название: </label>
            <input type="text" class="form-control" id="title" data-ng-model="group.title"
                   placeholder="Будет известно только вам">
        </div>

        <div class="form-group">
            <label for="passcode">Кодовое слово: </label>
            <input type="text" class="form-control" id="passcode" data-ng-model="group.passcode"
                   placeholder="Передайте его тем, кого хотите пригласить в группу">
        </div>
        <div class="row">
            <div class="col-sm-9">
                <label for="expiration">Срок действия кодового слова: </label>

                <p class="input-group" data-ng-hide="turnExpiration == 1">
                    <input id="expiration" type="text" class="form-control" data-datepicker-popup="dd MMMM yyyy"
                           data-ng-model="group.expiration"
                           data-is-open="opened"
                           data-min-date="minDate" data-datepicker-options="dateOptions"
                           data-ng-required="true"
                           data-show-button-bar="false"
                           data-ng-disabled="turnExpiration == 1"
                           readonly/>
              <span class="input-group-btn">
                <button type="button" data-ng-disabled="turnExpiration == 1" class="btn btn-default"
                        data-ng-click="open($event)"><i
                        class="glyphicon glyphicon-calendar"
                        ></i></button>
              </span>
                </p>
                <!-- DateTime picker placeholder (showing then switcher is ON) -->
                <p class="input-group" data-ng-if="turnExpiration == 1"><input id="expirationPlaceholder" disabled
                                                                               placeholder="БЕССРОЧНО"
                                                                               class="form-control">
                              <span class="input-group-btn">
                <button type="button" class="btn btn-default" disabled><i
                        class="glyphicon glyphicon-calendar"
                        ></i></button>
              </span</p>
                <!-- //Placeholder -->
            </div>
            <div class="col-sm-3">
                <div><label for="needExp">Бессрочно?</label></div>
                <div class="btn-group btn-toggle">
                    <button id="needExp" class="btn btn-default" data-ng-model="turnExpiration" data-btn-radio=1
                            data-ng-class="{'active btn-primary': turnExpiration == 1}">ДА
                    </button>
                    <button class="btn btn-default" data-ng-model="turnExpiration" data-btn-radio=0
                            data-ng-class="{'active btn-primary': turnExpiration == 0}">НЕТ
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary" data-ng-click="ok()">OK</button>
        <button class="btn btn-warning" data-ng-click="cancel()">Отмена</button>
    </div>
</script>
</body>
</html>
