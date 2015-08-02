<?php

$success = true ;
if($success){
  $achievements_in  = explode(',','A,B,E,F') ;
  $all_achievements = explode(',','A,B,C,D') ;
  $achievements_to_add = array() ;
  for($j=0 ; $j<count($achievements_in) ; $j++){
    $add = true ;
    for($i=0 ; $i<count($all_achievements) ; $i++){
      if($all_achievements[$i]==$achievements_in[$j]){
        $add = false ;
        break ;
      }
    }
    if($add){
      $achievements_to_add[] = $achievements_in[$j] ;
    }
  }
  if(count($achievements_to_add)>0){
    for($i=0 ; $i<count($achievements_to_add) ; $i++){
      $all_achievements[] = $achievements_to_add[$i] ;
    }
    $text = join(',',$all_achievements) ;
    echo $text ;
  }
}
?>

