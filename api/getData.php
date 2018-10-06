<?php
include "conn.php";

// $query = $db->query("SELECT * FROM perolehan WHERE week = '{$_POST['week']}'");
//$query = $db->query("SELECT week, MAX(tanggal) as tanggal, tipe_produk, plan, actual FROM perolehan WHERE week = '{$_POST['week']}' GROUP BY tipe_produk");
 // $query = $db->query("SELECT week, MAX(tanggal) as tanggal, tipe_produk, SUM(plan) as plan, SUM(actual) as actual FROM perolehan WHERE week = '{$_POST['week']}' GROUP BY tipe_produk");
//Query yg baru :
 $query = $db->query("SELECT week, tipe_produk, tanggal, SUM(plan) as plan, SUM(actual) as actual, if((sum(plan)-sum(actual))/sum(plan)>0, (sum(plan)-sum(actual))/sum(plan), 0) as plan2, if(sum(actual)>0, sum(actual)/sum(plan), 0) as actual2 FROM perolehan WHERE week = '{$_POST['week']}' and tanggal = (select tanggal from perolehan group by tanggal, week having sum(actual) > 0 and week = '{$_POST['week']}' order by tanggal desc limit 1) GROUP BY tipe_produk, week, tanggal");
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
