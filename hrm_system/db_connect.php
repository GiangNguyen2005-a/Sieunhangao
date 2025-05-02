<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = ""; // Mặc định XAMPP không có mật khẩu cho user root
$dbname = "quanlynhansu";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES utf8");
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $e->getMessage()]);
    exit();
}
?>