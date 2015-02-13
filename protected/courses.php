<?php
include_once '../index.php';   
try
{
    $stmtCoursesList = $DBH->prepare("SELECT * FROM tblCourses");
    $stmtCoursesList -> execute();
}
catch(PDOException $e)
{
    $response['status']=0;
    $response['message']='Database error!';
    die(json_encode($response)); 
}

$Result = $stmtCoursesList->fetchAll(PDO::FETCH_ASSOC);

if ($Result)
{
    $response['status']=1;
    $response['message']='Course list';
    $response['courses']=$Result;
    echo json_encode($response);
}
else
{
    $response['status']=0;
    $response['message']='Course list is empty!';
    die(json_encode($response));
}
?>