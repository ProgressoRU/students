<!DOCTYPE html>
<html lang="ru" data-ng-app="students" data-ng-cloak>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="/public/css/style.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.13/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.13/angular-resource.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.13/angular-route.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
    <script src="/public/lib/bootstrap/ui-bootstrap-tpls-0.12.0.min.js"></script>
    <script src="/public/js/app.js"></script>
    <script src="/public/js/services.js"></script>
    <script src="/public/js/controllers.js"></script>
    <script src="/public/js/directives.js"></script>
</head>
<body data-ng-controller="WrapCtrl" class="container-fluid">
<div>
    <alert ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)">{{ alert.msg }}</alert>
</div>
<div data-st-Header></div>
<div data-ng-view></div>
<div data-login-dialog></div>
</body>
</html>
