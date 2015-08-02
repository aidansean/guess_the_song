<?php
include_once('mysql.php') ;

$success = true ;
if(!isset($_GET['user_id'])) $success = false ;

if($success){
  $user_id = clean_string($_GET['user_id']) ;
  $query = 'SELECT * FROM guessSong_users WHERE user_id="' . $user_id . '" ORDER BY user_id DESC LIMIT 1' ;
  $result = mysqli_query($database_link,$query) ;
  while($row = mysqli_fetch_assoc($result)){
    $row_achievements = $row['achievements'] ;
    if(substr($row_achievements,0,1)==',') $row_achievements = substr($row_achievements,1) ;
    echo $row_achievements ;
    break ;
  }
}
?>

