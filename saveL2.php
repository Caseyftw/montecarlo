<?php 
ini_set ("display_errors", "1");
error_reporting(E_ALL);

$array = $_POST["data"];
$filename = 'discrepancies.txt';
$data = $array["data"];

file_put_contents($filename, $data . PHP_EOL, FILE_APPEND | LOCK_EX);
?>
