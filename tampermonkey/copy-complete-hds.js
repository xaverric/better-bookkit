// ==UserScript==
// @name         HDS Copy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy HDS in comment format
// @author       Daniel Jílek, Viktor Grešák
// @match        https://uuos9.plus4u.net/uu-bookkitg01-main/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const renderCopyHdsButton = () => {
        let hds = document.getElementsByClassName("uu-uuapp-designkit-reader-mode");
        if (hds.length !== 0){
            const text = hds[0].innerText
            let hdsArray = text.split(/\r?\n/);

            let result = "";
            let alternativeScenarioIndex = hdsArray.findIndex(item => item === "Alternative scenarios");
            if (alternativeScenarioIndex !== -1) {
                hdsArray = hdsArray.splice(1, alternativeScenarioIndex - 1);
            } else {
                hdsArray = hdsArray.splice(1, hdsArray.length - 1);
            }
            for (let i = 0; i < hdsArray.length; i += 2) {
                result += `// HDS ${hdsArray[i]} ${hdsArray[i + 1]} \n`;
            }

            let hdsDownload = document.createElement("button");
            hdsDownload.innerHTML = "Copy";
            hdsDownload.className = "uu5-bricks-button";
            hdsDownload.style = "border-radius: 5px;border: none; font-size: 19px; margin-left: 20px;";
            hdsDownload.onclick = () => {
                $('<textarea>').val(result).appendTo('body').select()
                document.execCommand('copy')
                hdsDownload.innerText = "Copied";
                hdsDownload.style.background = "#2ee59d";
            }
            hds[0].childNodes[0].childNodes[0].appendChild(hdsDownload);
            clearInterval(interval);
        }
    }

    let interval = setInterval(renderCopyHdsButton, 100);

})();