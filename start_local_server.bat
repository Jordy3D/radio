@ECHO OFF

TITLE Bane//Radio Local Server
ECHO Welcome to the Bane//Radio Local Server

SET PORT=
FOR /f "tokens=2 delims==" %%a IN ('findstr PORT .env') DO SET PORT=%%a

ECHO Opening browser...
START http://localhost:%PORT%
ECHO Browser opened

SET ymd=%date:~10,4%%date:~7,2%%date:~4,2%

ECHO Starting PHP server...
REM php -S localhost:%PORT% -t public public/router.php 2>&1 | tee logs/%ymd%-local.log
php -S localhost:%PORT% -t public 2>&1 | tee logs/%ymd%-local.log
