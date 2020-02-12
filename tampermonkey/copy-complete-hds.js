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

(function () {
    'use strict';

    const renderCopyHdsButton = () => {
        let hds = document.getElementsByClassName("uu-uuapp-designkit-reader-mode");
        if (hds.length !== 0) {
            const text = hds[0].innerText;
            let hdsArray = text.split(/\r?\n/);
            let result = [];
            let resultComplete = "";

            // Do not parse alternative scenarios
            let alternativeScenarioIndex = hdsArray.findIndex(item => item === "Alternative scenarios");
            if (alternativeScenarioIndex !== -1) {
                hdsArray = hdsArray.splice(1, alternativeScenarioIndex - 1);
            } else {
                hdsArray = hdsArray.splice(1, hdsArray.length - 1);
            }

            // prepare complete HDS and single HDS items
            for (let i = 0; i < hdsArray.length; i += 2) {
                let item = getHdsItem(hdsArray[i], hdsArray[i+1]);
                result.push(item);
                resultComplete += `${item.text} \n`;
            }

            // append button foo copy all HDS to header
            let copyAllHDs = getButton(resultComplete, "Copy","19px", "10px");
            hds[0].childNodes[0].childNodes[0].appendChild(copyAllHDs);

            // append single HDS copy buttons to the end of HDS section
            result.forEach(item => {
                appendButtonToHdsItems(item.text, item.number)
            });

            clearInterval(interval);
        }
    };

    const getButton = (value, buttonText, fontSize = "14px", margin = "0") => {
        let button = document.createElement("button");
        button.innerText = buttonText;
        button.className = "uu5-bricks-button";
        button.style = `border-radius: 40px;border: none; font-size: ${fontSize}; margin: ${margin}`;
        button.onclick = () => {
            $('<textarea>').val(value).appendTo('body').select();
            document.execCommand('copy');
            button.style.background = "#2ee59d";
        };
        return button;
    };

    const getHdsItem = (number, text) => {
        return {
            number: number,
            text: `// HDS ${number} ${text}`
        };
    };

    const appendButtonToHdsItems = (value, number) => {
        let hdsItems = document.getElementsByClassName("uu-uuapp-designkit-reader-mode-numbering");
        for (let i = 0; i < hdsItems.length; i++){
            let item = hdsItems[i];
            if (item.innerText === number){
                item.innerText = "";
                item.appendChild(getButton(value, number));
            }
        }
    };


    let interval = setInterval(renderCopyHdsButton, 100);

})();