chrome.storage.sync.get("extension_state", function(res){
    if(res["extension_state"]=="on"){
        var input=document.getElementsByClassName("im_editable im-chat-input--text _im_text")[0];
        document.addEventListener('keyup', function(){
            console.log(input.innerHTML);
            if(input.innerHTML!=""){
                chrome.storage.sync.get(input.innerHTML, function(res){
                    var src=res[input.innerHTML];
                    if(src !="" && src!=null){
                        input.innerHTML=src;
                    }
                });

            }
        },false);
    }
});

chrome.storage.onChanged.addListener(function(changes, namespace){
    for(var key in changes){
        var storageChange = changes[key];
        if(key=="extension_state" && storageChange.newValue=="on"){
            window.location.reload();
        }
    }
});