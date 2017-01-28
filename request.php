<?php
if (isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'getStatus':
            getStatus($_POST['element']);
            break;
        case 'loadArray':
            loadArray();
            break;
        case 'addElement':
            addElement($_POST['pin'], $_POST['element']);
            break;
        case 'updatePin':
            updatePin($_POST['pinId'], $_POST['value']);
            break;
        case 'removeFromArray':
            removeFromArray($_POST['element']);
            break;
        case 'getActualAlarm':
            getActualAlarm();
            break;
        case 'setNewAlarm':
            setNewAlarm($_POST['hour'], $_POST['minute'], $_POST['selectedOption']);
            break;
        case 'removeAlarm':
            removeAlarm();
            break;
    }
}

function removeAlarm(){
    $file = fopen('time.csv','w');    
    fclose($file);
    echo "Alarm is unset";
}

function getActualAlarm(){    
    $csvData = file_get_contents('time.csv');
    $lines = explode(PHP_EOL, $csvData);
    $array = array();
    foreach ($lines as $line) {
        $array[] = str_getcsv($line);
    }

    if(count($array) < 2 || empty($array)){
        echo "No Timer set";
        exit;
    }
    $string = "";
    for ($i=0; $i < 3; $i++) { 
        switch ($i) {
            case 0:
                $string .=$array[0][$i].":";
                break;
            case 1:
                $string .=$array[0][$i]." Uhr für ";
                break;
            case 2:
                $arr = json_decode(file_get_contents('array.json'), true);
                $string .=$arr[$array[0][$i]];
                break;
         }   
            
    }    
    echo $string;    
}

function setNewAlarm($hour, $minute, $selectedOption){
    $arr = json_decode(file_get_contents('array.json'), true);
    $pinId = 0;
    foreach ($arr as $key => $val) {        
        if(strcmp($val, $selectedOption) == 0){
            $pinId = $key;
            break;
        }
    }
    $list = array($hour, $minute, $pinId);
    $file = fopen('time.csv','w');    
    fputcsv($file,$list);        
    fclose($file);
    echo $hour.":".$minute." for Pin with Name: ". $selectedOption;
}

function getStatus($pinId) {
    $arr = json_decode(file_get_contents('array.json'), true);
    foreach ($arr as $key => $val) {        
        if(strcmp($val, $pinId) == 0){
            shell_exec("gpio mode " . $key . " out");
            $responseArr[$pinId] = shell_exec("gpio read " . $key);
            echo json_encode($responseArr);
            exit;
        }
    }
}

function removeFromArray($removeName){
    $arr = json_decode(file_get_contents('array.json'), true);
    foreach ($arr as $key => $val) {        
        if(strcmp($val, $removeName) == 0){
            unset($arr[$key]);
            file_put_contents("array.json",json_encode($arr));
            echo "Löschen war erfolgreich";
            exit;
        }
    }
    echo "Löschen war nicht erfolgreich! Lade die Seite neu.";
}


function addElement($pin, $element) {
    $arr = json_decode(file_get_contents('array.json'), true);
    $arr[$pin] = $element;   
    file_put_contents("array.json",json_encode($arr));
    echo $element;
    exit;
}

function loadArray() {
    $arr = json_decode(file_get_contents('array.json'), true);
    if($arr == null){
        echo null;
        exit;
    }
    $returnArr = array();
    foreach ($arr as $value) {
        array_push($returnArr, $value);
    }
    echo json_encode($returnArr);
    exit;
}

function updatePin($pinId, $value){
    $arr = json_decode(file_get_contents('array.json'), true);
    foreach ($arr as $key => $val) {        
        if(strcmp($val, $pinId) == 0){
            $pinOut = 1;
            if(strcmp($value, "true")){
                $pinOut = 0;
            } else {
                $pinOut = 1;
            }      
            shell_exec("gpio mode " . $key . " out");
            shell_exec("gpio write " . $key . " " . $pinOut);
            echo shell_exec("gpio read " . $key );
            exit;
        }
    }
}
?>