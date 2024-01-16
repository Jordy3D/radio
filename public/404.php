<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404</title>
    <link rel="icon" href="favicon.ico">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: #282828;
            color: #fff;
            font-family: sans-serif;
            text-align: center;

            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

        }

        h1 {
            font-size: 10rem;
            margin: 0;
        }

        h2 {
            font-size: 2rem;
            margin: 0;
        }
    </style>

    <style>
        :root
        {
            --frameSize: 30px;
            --frameBorderRadius: 50px;
            
            --mainLeft: var(--frameSize);
            --mainTop: var(--frameSize);

            --mainWidth: calc(100% - calc(var(--mainLeft) * 2));
            --mainHeight: calc(100% - calc(var(--mainTop) * 2));
        }

        /* CRT */
        html:not([stylus-iframe])::before {
            content: "hi";
            font-size: 0;
            display: block;
            width: var(--mainWidth);
            height: var(--mainHeight);
            margin: 0 auto;
            mix-blend-mode: hard-light;
            background: #0000;
            border-radius: var(--frameBorderRadius);
            opacity: 1 !important;
            pointer-events: none;
            position: fixed;
            top: var(--mainTop);
            left: var(--mainLeft);
            z-index: 3000;
            box-shadow: inset 10px 0 10px 0 #ff00006a, inset -10px 0 10px 0 #0000ff6a, 0 0 20pt 100pt #000;
        }

        html:not([stylus-iframe])::after {
            content: "";
            display: block;

            width: 100%;
            height: 100%;

            position: fixed;
            top: 0;

            z-index: 1000;

            pointer-events: none;

            background: black;

            -webkit-mask-image: radial-gradient(circle, #fff0 70%, #000);

            -webkit-animation-name: fade;
            -webkit-animation-duration: 3s;
            -webkit-animation-iteration-count: infinite;
            -webkit-animation-timing-function: ease-in-out;

            transform: translateZ(0px);

        }

        html:not([stylus-iframe]) body::before {
            content: "hi";
            font-size: 0;
            display: block;

            width: 100%;
            height: 110% !important;
            position: fixed;

            top: -50px;

            background-image: url(https://raw.githubusercontent.com/Jordy3D/Jordy3D.github.io/master/files/scan.png);
            background-size: 50px !important;

            opacity: 0.04 !important;

            mix-blend-mode: multiply;

            pointer-events: none;

            z-index: 2000;

            -webkit-animation-name: scan;
            -webkit-animation-duration: 1s;
            -webkit-animation-iteration-count: infinite;
            -webkit-animation-timing-function: linear;
        }

        @-webkit-keyframes scan {
            0% {
                background-position-y: 0px;
            }

            100% {
                background-position-y: 50px;
            }
        }

        @-webkit-keyframes fade {
            0% {
                opacity: 1;
                transform: scale(1);
            }

            80% {
                opacity: .99;
                transform: scale3D(1.002, 1.5, 1.0005);
            }

            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
    </style>
</head>

<body>
    <!-- a big 404 in the middle of the page -->
    <main>
        <h1>404</h1>
        <h2>You shouldn't be here</h2>
        <p>Please check the URL and try again.</p>
    </main>
</body>

</html>