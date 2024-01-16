<?php

function response($status, $status_message, $data)
{
    header("HTTP/1.1 " . $status);
    header("Content-Type:application/json");

    $response['status'] = $status;

    return $data;
}


// Get URL parameters
$text = $_GET["text"] ?? "";
$voice_model_id = $_GET["voiceId"] ?? "";
$timestamp = $_GET["timestamp"] ?? "";

if ($text == "" || $voice_model_id == "" || $timestamp == "") {
    echo response(400, "Bad Request", "Missing parameters");
    return;
}

// load env
$env = parse_ini_file('../../.env');

// if the env file is not set, return
if ($env == "") {
    echo response(500, "Internal Server Error", "Env file not set");
    return;
}

// Set variables
$model_id = "eleven_turbo_v2";
$similarity_boost = 0.75;
$stability = 0.35;

// set enabled flag
// TODO: move to env
$enabled = true;

if (!$enabled) {
    echo response(405, "Method Not Allowed", "Voice generation is disabled");
    return;
}

// API key
$xi_api_key = $env["XIAPIKEY"];

// if the api key is not set, return
if ($xi_api_key == "") {
    echo response(500, "Internal Server Error", "API key not set");
    return;
}

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.elevenlabs.io/v1/text-to-speech/" . $voice_model_id,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => "{\n  \"model_id\": \"$model_id\",\n  \"text\": \"$text\",\n  \"voice_settings\": {\n    \"similarity_boost\": 0.75,\n    \"stability\": 0.35\n  }\n}",

    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "xi-api-key: " . $xi_api_key
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

// download the file
$filePath = "../gen/";
$fileName = $timestamp . "-voice.mp3";
file_put_contents($filePath . $fileName, $response);

curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    echo response(200, "OK", "Voice generated successfully");
}