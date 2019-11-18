var on="on"; var off="off";
function updateState(){
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
window.onload=updateState();

var divs=[]; var trash="https://cdn2.iconfinder.com/data/icons/web/512/Trash_Can-512.png";
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
    loadPairs();
    var addButton= document.getElementById("addButton");
    var deleteButton = document.getElementById("deleteAll");
    var powerSwitch = document.getElementById("powerSwitch");
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
    addButton.addEventListener('click', function(){
        if(document.getElementById("src").value!="" && document.getElementById("word").value!=""){
            addNewPair(document.getElementById("src").value,document.getElementById("word").value);
            document.getElementById("src").value="";
            document.getElementById("word").value="";
        }else{
            alert("All inputs must be filled!");
        }
    }, false);
    deleteButton.addEventListener('click', function(){
        if(confirm("Are u sure?")){
            deleteAll();
        }
    },false);
},false);

function addNewPair(src, word){
    var element={};
    element[word]=src;
    chrome.storage.sync.set(element);
}

function loadPairs(){
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

function addElementToView(src, text){
    if(text!="extension_state"){
        let div = document.createElement('div');
        div.className="polaroid";
        div.id=""+divs.length+1;
        div.innerHTML="<a href="+src+"><img src="+src+"></a><div class=\"container\"><strong id=\"word"+divs.length+1+"\">"+text+"</strong><input type=\"image\" src="+trash+" class=\"trash\" id="+divs.length+1+"></div>";
        document.getElementById("imgs_box").appendChild(div);
        divs.unshift(div);
    }
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
    loadPairs();
    updateState();
});