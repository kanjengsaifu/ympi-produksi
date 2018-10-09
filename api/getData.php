<?php
include "conn.php";

// $query = $db->query("SELECT * FROM perolehan WHERE week = '{$_POST['week']}'");
//$query = $db->query("SELECT week, MAX(tanggal) as tanggal, tipe_produk, plan, actual FROM perolehan WHERE week = '{$_POST['week']}' GROUP BY tipe_produk");
 // $query = $db->query("SELECT week, MAX(tanggal) as tanggal, tipe_produk, SUM(plan) as plan, SUM(actual) as actual FROM perolehan WHERE week = '{$_POST['week']}' GROUP BY tipe_produk");
 
//Query yg baru :
$sql = "SELECT 
            week,
            tipe_produk,
            tanggal,
            SUM(plan) AS plan,
            SUM(actual) AS actual,
            IF((SUM(plan) - SUM(actual)) / SUM(plan) > 0,
                ((SUM(plan) - SUM(actual)) / SUM(plan))*100,
                0) AS plan2,
            IF(SUM(actual) > 0,
                ((SUM(actual) - SUM(IF((actual - plan) > 0,
                    actual - plan,
                    0))) / SUM(plan))*100,
                0) AS actual2
        FROM
            perolehan
        WHERE
            week = '{$_POST['week']}'
                AND tanggal = (SELECT 
                    tanggal
                FROM
                    perolehan
                GROUP BY tanggal , week
                HAVING SUM(actual) > 0 AND week = '{$_POST['week']}'
                ORDER BY tanggal DESC
                LIMIT 1)
        GROUP BY tipe_produk , week , tanggal";

$query = $db->query($sql);
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
