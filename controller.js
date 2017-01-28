
$(document).ready(function(){
	//appendToList("Test");
	var ajaxurl = 'request.php';

	$('#insert').click(function(){
		var data =  {'action': 'addElement', 'element': document.getElementById("name").value , 'pin': document.getElementById("pin").value};
        $.post(ajaxurl, data, function (response) {
            appendToList(response);            
        });
    });

    $('#remove').click(function(){
    	var removeButtons = document.getElementsByClassName("btn btn-danger");
    	Array.prototype.forEach.call(removeButtons, function(remBut){
    		if(remBut.style.display=="none"){
    			remBut.style.display = "inline-block";	
    		} else {
    			remBut.style.display = "none";	
    		}
    		
    	});
    });


	$('#removeAlarm').click(function(){
    	var data =  {'action': 'removeAlarm'};
        $.post(ajaxurl, data, function(response) {
        	alert(response);
        });
    });


    $('#alarmButton').click(function(){    	
		var data =  {'action': 'getActualAlarm'};
        $.post(ajaxurl, data, function(response) {
        	document.getElementById("actualTime").innerText = response;
        });

        data =  {'action': 'loadArray'};
        $.post(ajaxurl, data, function(response) {
        	var arr = JSON.parse(response);
        	removeAllOptions();
            arr.forEach(addOptionToList);
        });
    });

    function removeAllOptions(){
    	var dropDown = document.getElementById("sel1");
    	while (dropDown.firstChild) {
		    dropDown.removeChild(dropDown.firstChild);
		}
    }

    function addOptionToList(optionName){
    	var dropDown = document.getElementById("sel1");
    	var opt = document.createElement("option");
    	opt.textContent = optionName;
    	dropDown.appendChild(opt);
    }

	$('#setNewAlarm').click(function(){    	
		var selectBox = document.getElementById("sel1");
		var selectedOption = selectBox.options[selectBox.selectedIndex].text;
		var data =  {'action': 'setNewAlarm', 'hour': document.getElementById("hourAlarm").value, 'minute': document.getElementById("minuteAlarm").value, 'selectedOption': selectedOption};
        $.post(ajaxurl, data, function(response) {
        	alert(response);
        });
    });

	var data =  {'action': 'loadArray'};
    $.post(ajaxurl, data, function (response) {
            // Response div goes here.
            var arr = JSON.parse(response);
            arr.forEach(appendToList);
            arr.forEach(updateStatus);
        });

    function appendToList(name) {
    	var para = document.createElement("li");
    	para.id = name;
        
        var removeButton = document.createElement("button");     
        removeButton.type = "button";
        removeButton.className = "btn btn-danger";
        removeButton.textContent = "delete";
        removeButton.style.display ="none";
        removeButton.onclick = removeFromControl;
		para.appendChild(removeButton);
		
		var node = document.createTextNode(name);
        para.appendChild(node);
        
        var label = document.createElement("label");
        label.className = "switch";
        para.appendChild(label);

        var input = document.createElement("input");
        input.type = "checkbox";
        input.id = "input";
        input.onclick = check;
        label.appendChild(input);
        
        var slider = document.createElement("div");
        slider.className = "slider round";        
        label.appendChild(slider);
        
        var element = document.getElementById("liste");        
        element.appendChild(para);
    }

    function removeFromControl(){
		var ajaxurl = 'request.php',
		data =  {'action': 'removeFromArray', 'element': this.parentElement.id};
        $.post(ajaxurl, data, function(response) {
        	alert(response);
        });

    	var x = document.getElementById(this.parentElement.id);
    	x.remove(x.selectedIndex);

    }

    function updateStatus(name){
    	var ajaxurl = 'request.php',
		data =  {'action': 'getStatus', 'element': name};
        $.post(ajaxurl, data, function (response) {
        	var responseArr = JSON.parse(response);
        	console.log(responseArr);
        	var keys = Object.keys(responseArr);
        	if(responseArr[name].includes("1")){
        		document.getElementById(keys[0]).children[1].children[0].checked = 1;	
        	} else {
        		document.getElementById(keys[0]).children[1].children[0].checked = 0;
        	}
        });
    }

    function check(){
        var ajaxurl = 'request.php',
		data =  {'action': 'updatePin', 'pinId': this.parentElement.parentElement.innerText, 'value': this.checked};
        $.post(ajaxurl, data, function (response) {
        	console.log("value: "+response);
            this.checked = response;
        });
    }

});