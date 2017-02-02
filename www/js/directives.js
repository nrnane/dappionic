myapp.filter('CheckUserImage', function (API_URL) {
    return function (item) {
      //return item.replace(/[^\d|^,|^.]/g, '');
      var urlPattern = new RegExp("(http|ftp|https)://");
      var match = urlPattern.exec(item);
      if (match != null) {
          return item;
      } else {
          return API_URL+"uploads/"+item;
      }
    }
  });

myapp.factory('Socket', function (socketFactory) {
  var myIoSocket = io.connect('https://chatap2016.herokuapp.com/');
    mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    return mySocket;
  });


myapp.directive('ngEnter',function(){
    return function(scope,element,attrs){
      element.bind("keydown keypress",function(event){
          if(event.which===13){
            scope.$apply(function(){
              scope.$eval(attrs.ngEnter);
            });
            event.preventDefault();
          }
      });
    }
});

myapp.filter('numberEx', ['numberFilter', '$locale',
  function(number, $locale) {

    var formats = $locale.NUMBER_FORMATS;
    return function(input, fractionSize) {
      //Get formatted value
      var formattedValue = number(input, fractionSize);

      //get the decimalSepPosition
      var decimalIdx = formattedValue.indexOf(formats.DECIMAL_SEP);

      //If no decimal just return
      if (decimalIdx == -1) return formattedValue;


      var whole = formattedValue.substring(0, decimalIdx);
      var decimal = (Number(formattedValue.substring(decimalIdx)) || "").toString();

      return whole +  decimal.substring(1);
    };
  }]);
myapp.directive('ngConfirmClick', [
  function(){
    return {
      priority: -1,
      restrict: 'A',
      link: function(scope, element, attrs){
        element.bind('click', function(e){
          var message = attrs.ngConfirmClick;
          // confirm() requires jQuery
          if(message && !confirm(message)){
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        });
      }
    }
  }
]);

// Reddit constructor function to encapsulate HTTP and pagination logic
    myapp.factory('Reddit', function($http) {
      var Reddit = function() {
        this.items = [];
        this.busy = false;
        this.after = '';
      };

      Reddit.prototype.nextPage = function() {
        if (this.busy) return;
        this.busy = true;

        var url = "https://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
        $http.jsonp(url).success(function(data) {
          var items = data.data.children;
          for (var i = 0; i < items.length; i++) {
            this.items.push(items[i].data);
          }
          this.after = "t3_" + this.items[this.items.length - 1].id;
          this.busy = false;
        }.bind(this));
      };

      return Reddit;
    });

