import { EmoteFetcher, EmoteParser } from 'twitch-emoticons';
import hljs from 'highlight.js/lib/core'
import WebFont from 'webfontloader'
import {Promise} from "bluebird";

Promise.longStackTraces();

hljs.initHighlightingOnLoad();

const fetcher = new EmoteFetcher();
const parser = new EmoteParser(fetcher, {
    type: 'html',
    match: /\b(.+?)\b/g // /:(.+?):/g
});

function setupEmotes(){
    
}

function parseMessageEmotes(msg){
    const parsed = pasrser.parse(msg.innerHTML);
    msg.innerHTML = parsed;
}

function makeid(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function isCode(content){
     let confidence = 0;
     let strongKeywords = [
        "static",
        "void",
        "system.out",
        "java.",
        "import",
        "using",
        "float",
        "double",
        "string",
        "byte",
        "int",
        "public",
        "private",
        "class",
        "boolean",
        ";",
        "{",
        "}"
     ]

     let weakKeywords = [
        "while",
        "=",
        "return",
        ",",
        ":",
        "\"",
        "\'",
        "#"
     ]

    for(let i = 0; i < strongKeywords.length; i++){
        let val = content.match(new RegExp(strongKeywords[i], "g") || []);
     
        if(val != null)
            confidence += (val.length) * 2; // We add a x2 multiplier for strong keywords
    }

    for(let i = 0; i < weakKeywords.length; i++){
        let val = content.match(new RegExp(weakKeywords[i], "g") || []);

        if(val != null)
            confidence += val.length;
    }

    return confidence;
}

function highlight(){
    let msgs = document.getElementsByClassName("message--Z2rQ6JB");

    // Iterate all bongo messages
    for(let j = 0; j < msgs.length; j++){
        let msg = msgs[j];
        if(msg != undefined){
            // Only try to highlight objects we haven't iterated over yet
            if(!msg.classList.contains("bhjs-checked") || msg.classList.contains("bhjs-force")){
                let confidence = isCode(msg.innerText);
                if(confidence >= autoConfidenceValue || msg.classList.contains("bhjs-force")){
                    if(msg.classList.contains("bhjs-force"))
                        msg.classList.remove("bhjs-force");
                        
                    // Assign the message a unique ID so we can unhighlight later
                    let uuid = "bhjs-" + makeid(5);
                    msg.classList.add(uuid);

                    // Create new element to store state of message pre-highlight
                    let prenode = document.createElement("div");
                    prenode.innerHTML = msg.innerHTML;
                    prenode.style.display = "none";
                    prenode.classList.add(uuid + "-pre");

                    // Highlight the block
                    hljs.highlightBlock(msg);
                    msg.classList.add("bhjs-code");

                    // Create new element that lets user un-highlight element
                    let node = document.createElement("div");
                    node.classList.add("bhjs-rmhl-btn")
                    let textnode = document.createElement("span")
                    textnode.innerText = "Un-highlight";
                    textnode.addEventListener('click', function() {
                        // Find message by UUID
                        let msgobj = document.getElementsByClassName(uuid)[0];

                        // Find message's pre-syntax-highlighting state
                        let oldmsgobj = document.getElementsByClassName(uuid + "-pre")[0];

                        // Remove all highlighting related classes
                        msgobj.classList.remove(uuid);
                        msgobj.classList.remove("bhjs-code");
                        msgobj.classList.remove("hljs");

                        let msgHeader = msg.parentElement.parentElement.children[0];

                        let forceFormatBtn = document.createElement("span");
                        forceFormatBtn.addEventListener('click', function() {
                            msg.classList.add("bhjs-force");
                            forceFormatBtn.remove();
                            highlight();
                        });
                        forceFormatBtn.classList.add("bhjs-force-highlight");
                        forceFormatBtn.innerText = "Highlight"

                    msgHeader.appendChild(forceFormatBtn);

                        // Set element's state to old state
                        msgobj.innerHTML = oldmsgobj.innerHTML;

                        // Remove this "un-highlight message"
                        node.remove();
                    });

                    node.appendChild(textnode);

                    let fullnode = document.createElement("span");
                    fullnode.innerText = "Fullscreen";
                    fullnode.style.float = "right";
                    fullnode.addEventListener('click', function() {
                        let msgobj = document.getElementsByClassName(uuid)[0];
                        goFullscreen(msgobj);
                    });

                    node.appendChild(fullnode);

                    // Append our un-highlight button just below the user's message. Insert the new ndoe just below the index of the highlighted element
                    msg.parentElement.insertBefore(node, msg.parentElement.children[Array.prototype.indexOf.call(msg.parentElement.children, msg) + 1]);

                    // Append the hidden pre-highlight state node to the user's message
                    msg.appendChild(prenode);
                }else if(confidence >= manualConfidenceValue){
                    // Message might be code. Don't auto format it, but suggest the option
                    let msgHeader = msg.parentElement.parentElement.children[0];

                    let forceFormatBtn = document.createElement("span");
                    forceFormatBtn.addEventListener('click', function() {
                        msg.classList.add("bhjs-force");
                        forceFormatBtn.remove();
                        highlight();
                    });
                    forceFormatBtn.classList.add("bhjs-force-highlight");
                    forceFormatBtn.innerText = "Highlight"

                    msgHeader.appendChild(forceFormatBtn);
                }else {
                    const parsed = parser.parse(msg.innerText);
                    msg.innerHTML = parsed;
                }
            }

            // Add special class to note that element has already been checked
            msg.classList.add("bhjs-checked");
        }
    }
}

function goFullscreen(msg){
    
    // Find out what language the code is. highlight.js stores the language as the third class
    let language = msg.classList[3];

    let node = document.createElement("div");
    node.classList.add("bhjs-fullscreen");
    
    let bg = document.createElement("div");
    bg.classList.add("bhjs-fullscreen");
    bg.style.background = "rgba(0,0,0,0.6)";
    
    // Close fullscreen when background is clicked
    bg.addEventListener('click', function(){
        document.getElementsByClassName("bhjs-fullscreen")[0].remove();
    });

    node.appendChild(bg);

    // Create the window
    let codewindow = document.createElement("div");
    codewindow.classList.add("bhjs-code-window")
    let code = document.createElement("pre");
    code.className = msg.classList;
    code.innerHTML = msg.innerHTML;
    code.style.marginTop = "0";
    code.style.borderRadius = "0";
    code.style.minWidth = "100.1%";
    code.style.height = "66vh";
    for(let i = 0; i < code.children.length; i++){
        if(code.children[i].tagName === "BR")
            code.children[i].remove();
    }


    for(let i = 0; i < msg.attributes.length; i++){
        code.setAttribute(msg.attributes[i].name, msg.attributes[i].value);
    }

    codewindow.append(code);
    hljs.highlightBlock(code);

    // Find Message Author
    let author = msg.parentElement.parentElement.children[0].children[0].innerText;
    
    // Find Message Timestamp
    let time = msg.parentElement.parentElement.children[0].children[1].innerText;

    let subscriptAuthor = document.createElement("h2");
    subscriptAuthor.innerText = author;

    let subscriptTime = document.createElement("span");
    subscriptTime.innerText = time;

    let subscriptLanguage = document.createElement("span");
    subscriptLanguage.innerText = " : " + UppercaseFirst(language);

    let subscriptConfidence = document.createElement("span");
    subscriptConfidence.innerText = "Confidence: " + isCode(msg.innerText);
    subscriptConfidence.style.display = "block";

    let windowSubscript = document.createElement("div");

    windowSubscript.classList.add("bhjs-fs-window-sub")

    windowSubscript.appendChild(subscriptAuthor);
    windowSubscript.appendChild(subscriptTime);
    windowSubscript.appendChild(subscriptLanguage);
    windowSubscript.appendChild(subscriptConfidence);

    codewindow.append(windowSubscript);

    node.appendChild(codewindow);

    document.getElementsByTagName("body")[0].appendChild(node);
}

function UppercaseFirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createEmoteTab() {
    let emotePage = document.getElementById("emotes-page");
    if (emotePage != undefined) {
        emotePage.remove();
    }

    let chatWindow = document.getElementById("chat-messages");

    emotePage = window.createElement("div");
    emotePage.classList.add("")
}

WebFont.load({
    google: {
        families: ["Source Code Pro"]
    }
});

let autoConfidenceValue = 20;
let manualConfidenceValue = 8;

/*chrome.storage.sync.get(['autoConfidence', 'manualConfidence'], function (obj) {
    if(obj.autoConfidence == undefined) {
         obj.autoConfidence = 20;
    }

    if(obj.manualConfidence == undefined){
        obj.manualConfidence = 8;
    }

    console.log("[Bongo++] Loaded With The Following Settings")
    console.log(obj);

    autoConfidenceValue = obj.autoConfidence;
    manualConfidenceValue = obj.manualConfidence;

    setInterval(highlight, 1000);
});*/

fetcher.fetchTwitchEmotes();
fetcher.fetchBTTVEmotes();
fetcher.fetchBTTVEmotes(97950061)
fetcher.fetchBTTVEmotes(36646922)
fetcher.fetchBTTVEmotes(30393449)

setInterval(highlight, 1000);

console.log("Bongo++ Rewrite Loaded");