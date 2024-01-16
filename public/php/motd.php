
<?php
$motds = explode("\n", file_get_contents("motd.txt"));
echo "<script>const motds = " . json_encode($motds) . ";</script>";
