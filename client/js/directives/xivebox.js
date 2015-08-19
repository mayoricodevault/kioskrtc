'use strict';

xively.directive('xivebox',function(){
    return{
        restrict: 'E',
        template: '<table id="greeting" style="'+
                    'height: 630px;'+
                    'width: 800px;'+
                    '">'+
                    '<tr id="tr-0">'+
                        '<td id="td-0-0" class="gr"><div class="fadeOut animated" style="display:none;"></div></td>'+
                        '<td id="td-0-1" class="gr"><div class="fadeOut animated" style="display:none;"></div></td>'+
                        '<td id="td-0-2" class="gr"><div class="fadeOut animated" style="display:none;"></div></td>'+
                    '</tr>'+
                    '<tr id="tr-1">'+
                        '<td id="td-1-0" class="gr"><div class="fadeOut animated" style="display:none;"></div></td>'+
                        '<td id="td-1-1" class="gr"><div class="fadeOut animated" style="display:none;"></div></td>'+
                        '<td id="td-1-2" class="gr"><div class="fadeOut animated" style="display:none;"></div></td>'+
                    '</tr>'+
                    '<tr id="tr-2">'+
                        '<td id="td-2-0" class="gr"><div class="fadeOut animated" style="display:none;"></div></td>'+
                        '<td id="td-2-1" class="gr"><div class="fadeOut animated" style="display:none;"></div></td>'+
                        '<td id="td-2-2" class="gr"><div class="fadeOut animated" style="display:none;"></div></td>'+
                    '</tr>'+
                    '</table>',
        replace: true,
        transclude: true,
        link: function($scope,element,attrs){
            
            // adding xclass
            element.find('.gr').children().addClass(attrs.xclass);
            
            /*functions*/
            function getRandomInt(min,max){
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            
            $scope.onGreeting = function(data){
                console.log("*** onGreeting ***");
                var name = data.name;
                var id = data.id;
                var row,col,isValid = false;
                
                for(var i=0;i<1000;i++){
                  row = getRandomInt(0,2);
                  col = getRandomInt(0,2);
                  if($scope.matrix[row][col]==0){
                    isValid = true;
                    break;
                  }
                }
                
                if(isValid) {
                  $scope.matrix[row][col] = id;
                
                  var element = $("#td-" + row + "-" + col);
                  element = element.children();
                  element.empty();
                  element.append(name);
                  
                  element.removeClass("fadeOut");
                  element.css('display','');
                  
                  element.addClass('fadeIn').animate({opacity:'hide'},6000,'easeInExpo',function(){
                      $scope.matrix[row][col] = 0;
                  });
                }else{
                    console.log("not found");
                }
            }

            $scope.offGreeting = function(data){
              console.log("*** offGreeting ****");
                var id = data.id;
                var row,col;
                //search by id
                for(var i=0;i<3;i++){
                    for(var j=0;j<3;j++){
                        if($scope.matrix[i][j]==id){
                            row=i;col=j;
                            break;
                        }
                    }
                }
                
                // remove element from matrix //
                $scope.matrix[row][col]=0;
        
                // remove zoomIn class and add fadeOut //
                $("#td-"+row+"-"+col).children().removeClass('fadeIn');
                $("#td-"+row+"-"+col).children().addClass('fadeOut');
            }
        }
    };
});