<?php
include "conn.php";

$query = $db->query("SELECT week FROM perolehan WHERE week BETWEEN 40 AND 44 GROUP BY week ORDER BY week");
$rows = array();

if ($query->num_rows > 0) {
    while ($r = mysqli_fetch_assoc($query)) {
        $rows[] = $r;
    }
    $data['status'] = 'ok';
    $data['result'] = $rows;
} else {
    $data['status'] = 'err';
    $data['result'] = '';
}

echo json_encode($data);
