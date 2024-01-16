@ECHO OFF

SET LOCALIP=
SET PORT=
FOR /f "tokens=2 delims==" %%a IN ('findstr LOCALIP .env') DO SET LOCALIP=%%a
FOR /f "tokens=2 delims==" %%a IN ('findstr PORT .env') DO SET PORT=%%a

ECHO Opening browser...
START http://localhost:%PORT%
ECHO Browser opened