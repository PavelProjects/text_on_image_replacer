var on="on"; var off="off";var divs=[];
window.onload=function(){
    var powerSwitch = document.getElementById("powerSwitch");
    chrome.storage.sync.get('extension_state', function(res){
        var state=res["extension_state"];
        if(state==on){
            powerSwitch.style.backgroundColor="green";
            powerSwitch.firstChild.data="working"
            chrome.storage.sync.set({'extension_state':'on'});
            chrome.browserAction.setBadgeText({text: 'ON'});
        }else if(state==off){
            chrome.browserAction.setBadgeText({text: 'OFF'});
            powerSwitch.style.backgroundColor="red";
            powerSwitch.firstChild.data="disabled"
            chrome.storage.sync.set({'extension_state':'off'});
        }else{
            chrome.browserAction.setBadgeText({text: 'ON'});
            chrome.storage.sync.set({'extension_state':'on'});
            powerSwitch.style.backgroundColor="green";
            powerSwitch.firstChild.data="working"
        }
    });
}
document.addEventListener('DOMContentLoaded', function(){
    loadValues();
    var powerSwitch = document.getElementById("powerSwitch");
    var settingsButton= document.getElementById("settingsButton");
    var inputSearch = document.getElementById("searchInput");
    var searchButton = document.getElementById("searchButton");
    powerSwitch.addEventListener("click", function(){
        chrome.tabs.getSelected(null, function(tab){
            chrome.storage.sync.get('extension_state', function(res){
                var state=res["extension_state"];
                if(state==on){
                    powerSwitch.style.backgroundColor="red";
                    powerSwitch.firstChild.data="disabled"
                    chrome.storage.sync.set({'extension_state':'off'});
                    chrome.browserAction.setBadgeText({text: 'OFF'});
                }else if(state==off){
                    powerSwitch.style.backgroundColor="green";
                    powerSwitch.firstChild.data="working"
                    chrome.storage.sync.set({'extension_state':'on'});
                    chrome.browserAction.setBadgeText({text: 'ON'});
                }else{
                    chrome.browserAction.setBadgeText({text: 'ON'});
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
    inputSearch.addEventListener('keyup', function(event){
        if(event.keyCode==13){
            event.preventDefault();
            searchButton.click();
        }
    },false);
    searchButton.addEventListener('click', function(){
        divs.forEach(function(item, index, array){
            item.remove();
        });
        if(inputSearch.value==""){
            loadValues();
        }else{
            getValueByKey(inputSearch.value);
        }
    },false);
},false);

function loadValues(){
    chrome.storage.sync.get(null,function(items){
        var elements=Object.keys(items);
        console.log(elements);
        elements.forEach(function(key,index,array){
            chrome.storage.sync.get(key, function(res){
                addElementToView(res[key],key);
            });
        });
    });
}
function getValueByKey(key){
    chrome.storage.sync.get(key, function(res){
        if(res[key]!=null){
            addElementToView(res[key],key);
        }else{
            let div = document.createElement('div');
            div.id=""+divs.length+1;
            div.innerHTML="<h1>No results</h1>";
            document.getElementById("searchView").appendChild(div);
            divs.unshift(div);
        }
    });
}
function addElementToView(src, word){
    if(word!="extension_state" && word!="autosend"){
        let div = document.createElement('div');
        div.id=""+divs.length+1;
        div.innerHTML="<a href="+src+" target=\"_blank\"><div class=\"element\"><p id=\"word"+divs.length+1+"\" style=\"display:inline-block;\">"+word+"</p><div class=\"container\"><img class=\"content\" src=\""+src+"\"></div></div></a>";
        document.getElementById("searchView").appendChild(div);
        divs.unshift(div);
    }
}
