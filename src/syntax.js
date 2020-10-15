hljs.initHighlightingOnLoad();

function highlight() {
    // Get a list of all bongo message objects
    var msgs = document.getElementsByClassName("message--Z2rQ6JB");

    // Iterate all bongo messages
    for(j = 0; j < msgs.length; j++){
        var msg = msgs[j];
        if(msg != undefined){
            // Only try to highlight objects we haven't iterated over yet
            if(!msg.classList.contains("bhjs-checked") || msg.classList.contains("bhjs-force")){
                let confidence = isCode(msg);
                if(confidence > 20 || msg.classList.contains("bhjs-force")){
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
                }else if(confidence > 8){
                    // Message might be code. Don't auto format it, but suggest the option
                }
            }

            // Add special class to note that element has already been checked
            msg.classList.add("bhjs-checked");
        }
    }
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 //Determine is the message contains code
function isCode(msg) {
    let confidence = 0;
    let keywords = [
        "public",
        "static",
        "{",
        "}",
        ";",
        //"(",
        //")",
        "class",
        "void",
        "int",
        "while",
        "boolean",
        "String",
        "if",
        "float",
        "double",
        "System.out",
        "=",
        "return",
        "import",
        "java.",
        ",",
        ":",
        "\"",
        "\'",
        "#"
    ];

    
    for(i = 0; i < keywords.length; i++){
        let val = msg.innerText.match(new RegExp(keywords[i], "g") || []);
        if(val != null)
            confidence += val.length;
    }
    return confidence;
}

// Create a fullscreen instance of the code viewer
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

    let window = document.createElement("div");
    window.classList.add("bhjs-code-window")
    let code = document.createElement("pre");
    code.attributes = msg.attributes;
    code.className = msg.classList;
    code.innerHTML = msg.innerHTML;
    code.style.marginTop = "0";
    code.style.borderRadius = "0";
    code.style.minWidth = "100.1%";
    code.style.height = "66vh";
    for(i = 0; i < code.children.length; i++){
        if(code.children[i].tagName === "BR")
            code.children[i].remove();
    }
    window.append(code);
    hljs.highlightBlock(code);

    let author = msg.parentElement.parentElement.children[0].children[0].innerText;
    let time = msg.parentElement.parentElement.children[0].children[1].innerText;

    let subscriptAuthor = document.createElement("h2");
    subscriptAuthor.innerText = author;

    let subscriptTime = document.createElement("span");
    subscriptTime.innerText = time;

    let subscriptLanguage = document.createElement("span");
    subscriptLanguage.innerText = " : " + UppercaseFirst(language);

    let windowSubscript = document.createElement("div");

    windowSubscript.classList.add("bhjs-fs-window-sub")

    windowSubscript.appendChild(subscriptAuthor);
    windowSubscript.appendChild(subscriptTime);
    windowSubscript.appendChild(subscriptLanguage);

    window.append(windowSubscript);

    node.appendChild(window);

    document.getElementsByTagName("body")[0].appendChild(node);
}

function UppercaseFirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Load fonts
WebFont.load({
    google: {
        families: ["Source Code Pro"]
    }
});

console.log("[Bongo-Highlight] syntax.js loaded");

// Look for messages to syntax highlight every second.
// TODO: Look for an event handler to hook instead
setInterval(highlight, 1000);