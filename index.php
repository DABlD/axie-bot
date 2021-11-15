<?php
    date_default_timezone_set('Asia/Manila');

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    return json_encode(['test' => "success"]);
    // if(isset($_GET["func"]))
    // {
    //     $func = $_GET["func"];
    //     $func();
    // }
    
    // function save(){
    //     echo $_GET["ronin"];
    // }
?>