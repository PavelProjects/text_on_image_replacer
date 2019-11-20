var flag=false;
chrome.storage.sync.get("extension_state", function(res){
    if(res["extension_state"]=="on"){
        var input=document.getElementsByClassName("im_editable im-chat-input--text _im_text")[0];
        document.addEventListener('keyup', async function(){
            //console.log(input.innerHTML);
            if(input.innerHTML!=""){
                try{
                chrome.storage.sync.get(input.innerHTML, async function(res){
                    var src=res[input.innerHTML];
                    if(src !="" && src!=null){
                        input.innerHTML=src;
                        flag=true;
                    }
                });
            }catch(error){
                console.log(error);
            }
            }
        },false);
    }
});

chrome.storage.onChanged.addListener(function(changes, namespace){
    for (var key in changes) {
        if(key=="extension_state"){
            window.location.reload();
        }    
    }
});

var target = document.getElementsByClassName("im-chat-input--attaches")[0];
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        var img = document.getElementsByClassName("preview _preview")[0];
        var input=document.getElementsByClassName("im_editable im-chat-input--text _im_text")[0];
        try{
            if(flag){
                input.innerHTML="";
                chrome.storage.sync.get('autosend' ,function(res){
                    if(res['autosend']){
                        document.getElementsByClassName("im-send-btn im-chat-input--send _im_send im-send-btn_send")[0].click();
                    }
                });
                flag=false;
            }
        }catch(error){
            console.log(error);
        }
    });    
});
var config = {childList: true, subtree : true }
observer.observe(target, config);