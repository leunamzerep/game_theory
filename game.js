$(document).ready(function () {
    var step = 1;
    let error = false;
    var percievedValueBySeller;
    var topPriceBySeller;
    var proposedPriceBySeller;
    var percievedValueByBuyer;
    var topPriceByBuyer;
    var proposedPriceByBuyer;
    var averagePrice;
    var finalPrice;

    $(".next").on("click", function () {
        error = false;
        if (step === 4 || step === 8) {

            let prefix = (step === 4) ? "Seller" : "Buyer";

            let countPercieved = $("#percievedValueBy" + prefix).val().replace(/\D/g, "").length;
            let countTop = $("#topPriceBy" + prefix).val().replace(/\D/g, "").length;
            let countProposed = $("#proposedPriceBy" + prefix).val().replace(/\D/g, "").length;

            if (countPercieved < 6) {
                error = true;
                $("#percievedValueBy" + prefix).next().show();
            } else {
                $("#percievedValueBy" + prefix).next().hide();
            }
            if (countTop < 6) {
                error = true;
                $("#topPriceBy" + prefix).next().show();
            } else {
                $("#topPriceBy" + prefix).next().hide();
            }
            if (countProposed < 6) {
                error = true;
                $("#proposedPriceBy" + prefix).next().show();
            } else {
                $("#proposedPriceBy" + prefix).next().hide();
            }
        }

        if (error) {
            alert("Por favor, complete todos los campos con 6 o 7 dígitos.");
            return;
        } else {
            error = false;
            if (step == 8) {
                percievedValueBySeller = parseInt($("#percievedValueBySeller").val().replace(/\D/g, ""));
                topPriceBySeller = parseInt($("#topPriceBySeller").val().replace(/\D/g, ""));
                proposedPriceBySeller = parseInt($("#proposedPriceBySeller").val().replace(/\D/g, ""));
                percievedValueByBuyer = parseInt($("#percievedValueByBuyer").val().replace(/\D/g, ""));
                topPriceByBuyer = parseInt($("#topPriceByBuyer").val().replace(/\D/g, ""));
                proposedPriceByBuyer = parseInt($("#proposedPriceByBuyer").val().replace(/\D/g, ""));
                averagePrice = Math.round((topPriceBySeller + proposedPriceBySeller + topPriceByBuyer + proposedPriceByBuyer) / 4);

                let prices = [
                    averagePrice,
                    topPriceBySeller,
                    proposedPriceBySeller,
                    topPriceByBuyer,
                    proposedPriceByBuyer
                ];

                prices.sort((a, b) => a - b);

                prices.forEach((price, index) => {
                    let formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    $("#price" + (index + 1)).text(formatted + "$");
                });
            };
            $('#step' + step).hide();
            step++;
            $('#step' + step).show();
        }
    });

    $(".prices").on("click", function () {

        if ($(this).text() !== "Abandonar negociación") {
            finalPrice = parseInt($(this).text().replace(/\D/g, ""));
        } else {
            finalPrice = "NN";
        }

        var payload = {
            sellerPercieved: percievedValueBySeller,
            sellerTop: topPriceBySeller,
            sellerProposed: proposedPriceBySeller,
            buyerPercieved: percievedValueByBuyer,
            buyerTop: topPriceByBuyer,
            buyerProposed: proposedPriceByBuyer,
            average: averagePrice,
            chosenPrice: finalPrice
        };

        let url = "https://script.google.com/macros/s/AKfycbzJZ9Haajfw5EUKom5rKWj5GW2oyQXp2Ss-jv91uRVVsO0jeakRbMyoZ6DX9B-GkpPGKQ/exec?" + new URLSearchParams(payload);

        fetch(url)
            .then(r => r.json())
            .then(r => console.log("Guardado en Sheets:", r))
            .catch(err => console.error("Error guardando:", err));

        $('#step' + step).hide();
        step++;
        $('#step' + step).show();
    });

    $(".moneyInput").on("focus", function () {
        if ($(this).val() === "$") {
            setCaret(this, 0);
        }
    });

    $(".moneyInput").on("input", function () {
        let val = $(this).val().replace(/\D/g, "");
        if (val.startsWith("0")) {
            val = val.replace(/^0+/, "");
        }
        val = val.slice(0, 7);
        let formatted = val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        $(this).val(formatted + " $");
        setCaret(this, formatted.length);
    });

    function setCaret(el, pos) {
        requestAnimationFrame(() => {
            el.setSelectionRange(pos, pos);
        });
    }

    $(".copyLink").on("click", function () {
        let url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert("¡Link copiado al portapapeles!");
        }).catch(err => {
            console.error("Error al copiar: ", err);
        });
    });
});
