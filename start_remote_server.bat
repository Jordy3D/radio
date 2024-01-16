@ECHO OFF

TITLE Bane//Radio Remote Server
ECHO Welcome to the Bane//Radio Remote Server

SET REMOTEIP=
SET PORT=
FOR /f "tokens=2 delims==" %%a IN ('findstr REMOTEIP .env') DO SET REMOTEIP=%%a
FOR /f "tokens=2 delims==" %%a IN ('findstr PORT .env') DO SET PORT=%%a

ECHO Opening browser...
START http://%REMOTEIP%:%PORT%
ECHO Browser opened

SET ymd=%date:~10,4%%date:~7,2%%date:~4,2%

ECHO Starting PHP server...
php -S 0.0.0.0:%PORT% -t public 2>&1 | tee logs/%ymd%-remote.log