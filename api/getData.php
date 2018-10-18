<?php
include "conn.php";
include "inc/chromePhp.php";

// $query = $db->query("SELECT * FROM perolehan WHERE week = '{$_POST['week']}'");
//$query = $db->query("SELECT week, MAX(tanggal) as tanggal, tipe_produk, plan, actual FROM perolehan WHERE week = '{$_POST['week']}' GROUP BY tipe_produk");
 // $query = $db->query("SELECT week, MAX(tanggal) as tanggal, tipe_produk, SUM(plan) as plan, SUM(actual) as actual FROM perolehan WHERE week = '{$_POST['week']}' GROUP BY tipe_produk");
//Query yg baru :
 // $query = $db->query("SELECT week, tipe_produk, tanggal, SUM(plan) as plan, SUM(actual) as actual, if((sum(plan)-sum(actual))/sum(plan)>0, (sum(plan)-sum(actual))/sum(plan), 0) as plan2, if(sum(actual)>0, sum(actual)/sum(plan), 0) as actual2 FROM perolehan WHERE week = '{$_POST['week']}' and tanggal = (select tanggal from perolehan group by tanggal, week having sum(actual) > 0 and week = '{$_POST['week']}' order by tanggal desc limit 1) GROUP BY tipe_produk, week, tanggal");
 
$sql = "SELECT 
            tes.week,
            tes.tanggal,
            tes.produk,
            tes.plan,
            tes.actual,
            tes.plan_yest,
            tes.actual_yest,
            (((tes.actual - tes.actual_yest)/(tes.plan - tes.plan_yest))*100) AS actual2
        FROM
            (SELECT 
                week,
                    tipe_produk AS produk,
                    tanggal,
                    SUM(plan) AS plan,
                    SUM(actual) AS actual,
                    DATE_SUB(tanggal, INTERVAL 1 DAY) AS tanggal_yest,
                    (SELECT 
                            SUM(plan)
                        FROM
                            perolehan
                        WHERE
                            tanggal = tanggal_yest
                                AND tipe_produk = produk
                        GROUP BY tipe_produk) AS plan_yest,
                    (SELECT 
                            SUM(actual)
                        FROM
                            perolehan
                        WHERE
                            tanggal = tanggal_yest
                                AND tipe_produk = produk
                        GROUP BY tipe_produk) AS actual_yest
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
            GROUP BY tipe_produk , week , tanggal) AS tes";

// ChromePhp::log($sql);

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
