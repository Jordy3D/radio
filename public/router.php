<?php

// define url path
$path = "/radio";

// Get the requested URI
$request_uri = $_SERVER['REQUEST_URI'];

echo $request_uri;


// if the request uri is /radio, do nothing
if ($request_uri == $path || $request_uri == "/404.php") {
    return false;
}

// if the request uri is /, redirect to /radio
if ($request_uri == "/" || $request_uri == "") {
    header("Location: " . $path);
    exit;
}

return false;