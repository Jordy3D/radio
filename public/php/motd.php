
<?php
$lines = explode("\n", file_get_contents("motd.txt"));

$motds = [];
foreach ($lines as $line) {
    $line = trim($line);

    if ($line != "" && substr($line, 0, 1) != ";" && $line != "\n")
        $motds[] = $line;
}

// parse the motds, replacing custom tags with html
for ($i = 0; $i < count($motds); $i++) {
    $motds[$i] = parseMessage($motds[$i]);
}

function parseMessage($motdRaw)
{
    $motd = trim($motdRaw);

    // if the message contains <glitch>text</glitch>, replace it with
    // <span class="glitch" data-text="text">text</span>
    $motd = preg_replace(
        "/<glitch>(.*?)<\/glitch>/",
        "<span class=\"glitch\" data-text=\"$1\">$1</span>",
        $motd
    );
    // if the message contains <glitch text="alt">text</glitch>
    // replace it with <span class="glitch" data-text="alt">text</span>
    $motd = preg_replace(
        "/<glitch text=\"(.*?)\">(.*?)<\/glitch>/",
        "<span class=\"glitch\" data-text=\"$1\">$2</span>",
        $motd
    );

    // if the message contains <discord>text</discord>, replace it with
    // <span class="discord">text</span>
    $motd = preg_replace(
        "/<discord>(.*?)<\/discord>/",
        "<span class=\"discord\">$1</span>",
        $motd
    );

    // if a message contains <wiggle>text</wiggle>,
    // replace it with <span class="wiggle"><w1>t</w1><w2>e</w2><w1>x</w1><w2>t</w2></span>
    $motd = preg_replace_callback(
        "/<wiggle>(.*?)<\/wiggle>/",
        function ($matches) {
            $text = $matches[1];
            $out = "<span class=\"wiggle\">";

            for ($i = 0; $i < strlen($text); $i++) {
                $oneortwo = $i % 2 == 0 ? "w1" : "w2";
                $out .= "<$oneortwo>" . $text[$i] . "</$oneortwo>";
            }

            $out .= "</span>";

            return $out;
        },
        $motd
    );

    // if a message contains <rainbow>text</rainbow>,
    // replace it with <span class="rainbow">text</span>
    $motd = preg_replace(
        "/<rainbow>(.*?)<\/rainbow>/",
        "<span class=\"rainbow\">$1</span>",
        $motd
    );

    return $motd;
}


echo "<script>const motds = " . json_encode($motds) . ";</script>";
