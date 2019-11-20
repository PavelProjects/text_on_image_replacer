var on="on"; var off="off";
var divs=[]; var trash="https://cdn2.iconfinder.com/data/icons/web/512/Trash_Can-512.png";
function updateState(){
    var powerSwitch = document.getElementById("powerSwitch");
    var checkBoxAutoSend = document.getElementById("autosendCheckBox");
    chrome.storage.sync.get(['extension_state','autosend'], function(res){
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
        var autosend=res.autosend;
        if(autosend){
            checkBoxAutoSend.checked=true;
        }else{
            checkBoxAutoSend.checked=false;
        }
    });
}
window.onload=updateState();

document.addEventListener("click", function(event){
    if(event.target.className=="trash"){
        if(confirm("are u sure?")){
            console.log(document.getElementById("word"+event.target.id).innerText);
            try{
                chrome.storage.sync.remove(document.getElementById("word"+event.target.id).innerText);
                re=document.getElementById(event.target.id);
                re.remove();
            }catch(error){
                console.log(error);
                alert("Error:"+error);
            }
        }
    }
});
document.addEventListener('DOMContentLoaded', function(){
    loadAll();
    var addButton= document.getElementById("addButton");
    var deleteButton = document.getElementById("deleteAll");
    var powerSwitch = document.getElementById("powerSwitch");
    var inputName = document.getElementById("word");
    var inputSrc = document.getElementById("src");
    var checkBoxAutoSend = document.getElementById("autosendCheckBox");
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
    inputName.addEventListener("keyup", function(event){
        if(event.keyCode==13){
            event.preventDefault();
            addButton.click();
        }
    },false);
    inputSrc.addEventListener("keyup", function(event){
        if(event.keyCode==13){
            event.preventDefault();
            addButton.click();
        }
    },false);
    addButton.addEventListener('click', function(){
        if(inputSrc.value!="" && inputName.value!=""){
            addNewPair(inputSrc.value,inputName.value);
            inputSrc.value="";
            inputName.value="";
        }else{
            alert("All inputs must be filled!");
        }
    }, false);
    deleteButton.addEventListener('click', function(){
        if(confirm("Are u sure?")){
            deleteAll();
        }
    },false);
    checkBoxAutoSend.addEventListener('click', function(event){
        chrome.storage.sync.set({'autosend':checkBoxAutoSend.checked});
    },false);
},false);

function addNewPair(src, word){
    var element={};
    element[word]=src;
    chrome.storage.sync.set(element);
}
function loadAll(){
    chrome.storage.sync.get(null,function(items){
        var i=0;
        var counter=document.getElementById("count");
        var elements=Object.keys(items);
        console.log(elements);
        elements.forEach(function(key,index,array){
            if(key!="extension_state" && key!="autosend"){
                chrome.storage.sync.get(key, function(res){
                    addElementToView(res[key],key);
                });
                i++;
            }
        });
        counter.innerHTML=i;
    });
}

function addElementToView(src, text){
    let div = document.createElement('div');
    div.className="polaroid";
    div.id=""+divs.length+1;
    div.innerHTML="<a href="+src+" target=\"_blank\"><img src="+src+"></a><div class=\"container\"><strong id=\"word"+divs.length+1+"\">"+text+"</strong><input type=\"image\" src="+trash+" class=\"trash\" id="+divs.length+1+"></div>";
    document.getElementById("imgs_box").appendChild(div);
    divs.unshift(div);
}

function deleteAll(){
    divs.forEach(function(item, index, array){
        item.remove();
    });
    chrome.storage.sync.clear(function(){alert("clear");});
}


chrome.storage.onChanged.addListener(function(changes, namespace) {
    divs.forEach(function(item, index, array){
        item.remove();
    });
    loadAll();
    updateState();
});
