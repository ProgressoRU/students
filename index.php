<!DOCTYPE html>
<html lang="ru">
    <head>
    <meta charset="UTF-8">      
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Авторизация</title>
    <link rel="stylesheet" href="app/css/bootstrap.css"/>
    <link rel="stylesheet" href="app/css/bootstrap-responsive.css"/>
    </head>
    <body>
    <div class="container" >

      <form class="form-signin" action="app/back/auth.php" method="post">
        <h2 class="form-signin-heading">Вход в панель администратора</h2>
        <label for="login" class="sr-only">Логин</label>
        <input type="login" id="login" class="form-control" placeholder="" name="login" required autofocus>
        <label for="password" class="sr-only">Пароль</label>
        <input type="password" id="password" class="form-control" placeholder="" name="password" required>
        <div class="checkbox">
          <label>
            <input type="checkbox" value="remember-me"> Запомнить меня
          </label>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Войти</button>
      </form>

    </div>
    </body>
</html>