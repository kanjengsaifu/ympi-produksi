<?php
include "conn.php";

// $query = $db->query("SELECT * FROM perolehan WHERE week = '{$_POST['week']}'");
$query = $db->query("SELECT week, MAX(tanggal) as tanggal, tipe_produk, SUM(plan) as plan, SUM(actual) as actual FROM perolehan WHERE week = '{$_POST['week']}' GROUP BY tipe_produk");
$rows = array();

if ($query->num_rows > 0) {
    while ($r = mysqli_fetch_assoc($query)) {
        $rows[] = $r;
    }
    $data['status'] = 'ok';
    $data['week'] = $rows[0]['week'];
    $data['result'] = $rows;
} else {
    $data['status'] = 'err';
    $data['result'] = '';
}

echo json_encode($data);
