var on="on"; var off="off";
window.onload=function(){
    var powerSwitch = document.getElementById("powerSwitch");
    chrome.storage.sync.get('extension_state', function(res){
        var state=res["extension_state"];
        if(state==on){
            powerSwitch.style.backgroundColor="green";
            powerSwitch.firstChild.data="working"
            chrome.storage.sync.set({'extension_state':'on'});
        }else if(state==off){
            powerSwitch.style.backgroundColor="red";
            powerSwitch.firstChild.data="disabled"
            chrome.storage.sync.set({'extension_state':'off'});
        }else{
            chrome.storage.sync.set({'extension_state':'on'});
            powerSwitch.style.backgroundColor="green";
            powerSwitch.firstChild.data="working"
        }
    });
}
document.addEventListener('DOMContentLoaded', function(){
    var powerSwitch = document.getElementById("powerSwitch");
    var settingsButton= document.getElementById("settingsButton");
    powerSwitch.addEventListener("click", function(){
        chrome.tabs.getSelected(null, function(tab){
            chrome.storage.sync.get('extension_state', function(res){
                var state=res["extension_state"];
                if(state==on){
                    powerSwitch.style.backgroundColor="red";
                    powerSwitch.firstChild.data="disabled"
                    chrome.storage.sync.set({'extension_state':'off'});
                }else if(state==off){
                    powerSwitch.style.backgroundColor="green";
                    powerSwitch.firstChild.data="working"
                    chrome.storage.sync.set({'extension_state':'on'});
                }else{
                    chrome.storage.sync.set({'extension_state':'on'});
                    powerSwitch.style.backgroundColor="green";
                    powerSwitch.firstChild.data="working"
                }
            });
        });
    },false);
    settingsButton.addEventListener('click',function(){
        try{
            string =chrome.runtime.getURL('settings.html');
            console.log(string);
            chrome.tabs.create({url: string});
        }catch(error){
            alert("Error: "+error);
        }
    },false);
},false);