
const supabaseClient = window.supabase.createClient(
    "https://gjmcwrgjwskbwiofelzr.supabase.co",
    "sb_publishable_z8Tnr5vsn-gyY_YuNkYcCw_znM_DOs0"
);

$(document).ready(function () {
    let score = 0;
    let time = 20;
    let timer;
    let gameStarted = false;
    let playerName = "";
    let gameEnabled = false;

    function loadLeaderboard() {
        supabaseClient
            .from("scores")
            .select("*")
            .order("score", { ascending: false })
            .limit(10)
            .then(({ data, error }) => {
                if (error) {
                    console.log(error);
                    return;
                }

                let html = "";

                data.forEach((player, index) => {
                    html += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${player.player_name}</td>
                            <td>${player.score}</td>
                        </tr>
                    `;
                });

                $("#leaderboard tbody").html(html);
            });
    }

    function resetGame() {
        score = 0;
        time = 20;
        gameStarted = false;
        gameEnabled = false;

        clearInterval(timer);

        $("#score").text(score);
        $("#time").text(time);
        $(".box").hide().css({ left: "0px", top: "0px" });
    }

    function moveBox() {
        const gameArea = $("#gameArea");
        const box = $(".box");
        const maxX = gameArea.innerWidth() - box.outerWidth();
        const maxY = gameArea.innerHeight() - box.outerHeight();
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        box.css({
            left: x + "px",
            top: y + "px"
        });
    }

    function showGameOver() {
        clearInterval(timer);
        gameEnabled = false;

        $(".box").hide();
        $("#gameArea").hide();

        $("#finalPlayerName").val(playerName);
        $("#finalScoreBox").val("Score: " + score);

        $("#startPanel").hide();
        $("#gameInfo").hide();
        $("#endStats").css("display", "flex");
        $("#gameTitle").addClass("small-title");

        $("#leaderboardTitle").show();
        $("#leaderboard").show();
        $("#restart").show();

        supabaseClient
            .from("scores")
            .insert([
                {
                    player_name: playerName,
                    score: score
                }
            ])
            .then(({ error }) => {
                if (error) {
                    console.error(error);
                } else {
                    loadLeaderboard();
                }
            });
    }

    resetGame();
    loadLeaderboard();

    $("#startBtn").click(function () {
        playerName = $("#playerName").val().trim();

        if (playerName === "") {
            alert("Please enter your name.");
            return;
        }

        gameEnabled = true;
        $(".box").show();
        moveBox();

        $("#playerName").prop("disabled", true);
        $("#startBtn").prop("disabled", true);
    });

    $(".box").click(function () {
        if (!gameEnabled) {
            return;
        }

        if (!gameStarted) {
            gameStarted = true;

            timer = setInterval(function () {
                time--;
                $("#time").text(time);

                if (time <= 0) {
                    showGameOver();
                }
            }, 1000);
        }

        score++;
        $("#score").text(score);
        moveBox();
    });

    $("#restart").click(function () {
        playerName = "";

        $("#playerName").prop("disabled", false).val("");
        $("#startBtn").prop("disabled", false);

        $("#restart").hide();
        $("#leaderboard").hide();
        $("#leaderboardTitle").hide();
        $("#endStats").hide();

        $("#startPanel").css("display", "flex");
        $("#gameInfo").css("display", "flex");
        $("#gameTitle").removeClass("small-title");
        $("#gameArea").show();

        resetGame();
    });
});
