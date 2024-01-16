@ECHO OFF

SET REMOTEIP=
SET PORT=
FOR /f "tokens=2 delims==" %%a IN ('findstr REMOTEIP .env') DO SET REMOTEIP=%%a
FOR /f "tokens=2 delims==" %%a IN ('findstr PORT .env') DO SET PORT=%%a

ECHO Opening browser...
START http://localhost:%PORT%
ECHO Browser opened