xively.controller('openmenuController', ['$scope', 'Socket', function($scope, Socket){
    Socket.connect();
    
    $scope.blacks = false;
    $scope.blackm = false;
    $scope.blackl = false;
    
    $scope.mochal = false;
    $scope.mocham = false;
    $scope.mochas = false;
    
    $scope.icedl = false;
    $scope.icedm = false;
    $scope.iceds = false;
    
    $scope.lattel = false;
    $scope.lattem = false;
    $scope.lattes = false;
    
    $scope.cappuccinol = false;
    $scope.cappuccinom = false;
    $scope.cappuccinos = false;
    
    $scope.otherl = false;
    $scope.otherm = false;
    $scope.others = false;
    
    $scope.numberofusers=0;
    $scope.individualBoard=0;

    Socket.on('xternal', function(data){
    
        if (data.action=="iu") {
            $scope.numberofusers = data.value;
        }
        if (data.action=="ib") {
            $scope.individualBoard = data.value;
        }
        if (data.action=="reset") {
            $scope.individualBoard = data.value;
            $scope.numberofusers = data.value;
        }
        
         
    });
    
    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    });
    
    $scope.defaultValues = function() {
       $scope.blacks = true; 
    };
    
    $scope.isActive = function(value) {
        switch (value) {
            case 1: return $scope.blacks;
            case 2: return $scope.blackm;
            case 3: return $scope.blackl;
            
            case 4: return $scope.mochas;
            case 5: return $scope.mocham;
            case 6: return $scope.mochal;
            
            case 7: return $scope.iceds;
            case 8: return $scope.icedm;
            case 9: return $scope.icedl;
            
            case 10: return $scope.lattes;
            case 11: return $scope.lattem;
            case 12: return $scope.lattel;
            
            case 13: return $scope.cappuccinos;
            case 14: return $scope.cappuccinom;
            case 15: return $scope.cappuccinol;
            
            case 16: return $scope.others;
            case 17: return $scope.otherm;
            case 18: return $scope.otherl;
            
            default:
                // code
                break;
        }
    };
    
    $scope.activate = function(value) {
        $scope.blacks = false;
        $scope.blackm = false;
        $scope.blackl = false;
        
        $scope.mochal = false;
        $scope.mocham = false;
        $scope.mochas = false;
        
        $scope.icedl = false;
        $scope.icedm = false;
        $scope.iceds = false;
        
        $scope.lattel = false;
        $scope.lattem = false;
        $scope.lattes = false;
        
        $scope.cappuccinol = false;
        $scope.cappuccinom = false;
        $scope.cappuccinos = false;
        
        $scope.otherl = false;
        $scope.otherm = false;
        $scope.others = false;
           
        switch (value) {
            case 1: $scope.blacks = true; break;
            case 2: $scope.blackm = true; break;
            case 3: $scope.blackl = true; break;
            
            case 4: $scope.mochas = true; break;
            case 5: $scope.mocham = true; break;
            case 6: $scope.mochal = true; break;
            
            case 7: $scope.iceds = true; break;
            case 8: $scope.icedm = true; break;
            case 9: $scope.icedl = true; break;
            
            case 10: $scope.lattes = true; break;
            case 11: $scope.lattem = true; break;
            case 12: $scope.lattel = true; break;
            
            case 13: $scope.cappuccinos = true; break;
            case 14: $scope.cappuccinom = true; break;
            case 15: $scope.cappuccinol = true; break;
            
            case 16: $scope.others = true; break;
            case 17: $scope.otherm = true; break;
            case 18: $scope.otherl = true; break;
            
            default:
                // code
                break;
        }
    };
}])