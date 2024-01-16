@ECHO OFF

TITLE Bane//Radio LAN Server
ECHO Welcome to the Bane//Radio LAN Server

SET LOCALIP=
SET PORT=
FOR /f "tokens=2 delims==" %%a IN ('findstr LOCALIP .env') DO SET LOCALIP=%%a
FOR /f "tokens=2 delims==" %%a IN ('findstr PORT .env') DO SET PORT=%%a

ECHO Opening browser...
START http://%LOCALIP%:%PORT%
ECHO Browser opened

SET ymd=%date:~10,4%%date:~7,2%%date:~4,2%

ECHO Starting PHP server...
php -S %LOCALIP%:%PORT% -t public 2>&1 | tee logs/%ymd%-lan.log