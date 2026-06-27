$(document).ready(function () {

    let score;
    let time;
    let timer;
    let gameStarted;

    function startGame() {

        score = 0;
        time = 20;
        gameStarted = false;

        $("#score").text(score);
        $("#time").text(time);

        $(".box").show();

        // Move box back to starting position
        $(".box").css({
            left: "0px",
            top: "0px"
        });

        $("#container").hide();

        clearInterval(timer);
    }

    // Start game when page loads
    startGame();

    $(".box").click(function () {

        // Start timer only on first click
        if (!gameStarted) {

            gameStarted = true;

            timer = setInterval(function () {

                time--;
                $("#time").text(time);

                if (time <= 0) {

                    clearInterval(timer);

                    $(".box").hide();

                    $("#finalScore").text(score);

                    $("#container").css("display", "flex");
                }

            }, 1000);
        }

        // Random position
        let x = Math.random() * 375;
        let y = Math.random() * 375;

        $(".box").css({
            left: x + "px",
            top: y + "px"
        });

        // Increase score
        score++;
        $("#score").text(score);

    });

    // Restart button
    $("#restart").click(function () {
        startGame();
    });

});