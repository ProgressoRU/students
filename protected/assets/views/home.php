<!DOCTYPE html>
<html lang="ru" ng-app="students" ng-cloak>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js" ></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="/public/css/style.css">
    <script src="/public/lib/angular/angular.min.js"></script>
    <script src="/public/lib/angular/angular-resource.min.js"></script>
    <script src="/public/lib/angular/angular-route.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
    <script src="/public/js/app.js"></script>
    <script src="/public/js/services.js"></script>
    <script src="/public/js/controllers.js"></script>
    <script src="/public/js/directives.js"></script>
</head>
<body ng-controller="GeneralCtrl">
<st-Header></st-Header>
<div ng-view></div>
</body>
</html>
