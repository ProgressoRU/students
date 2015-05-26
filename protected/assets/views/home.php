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
    <script src="/public/app/auth/auth.service.js"></script>
    <script src="/public/app/alerts/alerts.module.js"></script>
    <script src="/public/app/alerts/alerts.js"></script>
    <script src="/public/app/alerts/constants.js"></script>
    <script src="/public/app/shared/session.service.js"></script>
    <script src="/public/app/auth/authevents.constant.js"></script>
    <script src="/public/app/news/news.controller.js"></script>
    <script src="/public/app/editors/editor.module.js"></script>
    <script src="/public/app/editors/newsEditor.directive.js"></script>
    <script src="/public/app/editors/lectureEditor.directive.js"></script>
    <script src="/public/app/auth/auth.controller.js"></script>
    <script src="/public/app/auth/authmodal.directive.js"></script>
    <script src="/public/app/groups/newgroup.controller.js"></script>
    <script src="/public/app/groups/subscription.controller.js"></script>
    <script src="/public/app/disciplines/discipline.controller.js"></script>
    <script src="/public/app/userRights/userRights.controller.js"></script>
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
</body>
</html>
