//$('#myTab a').click(function (e) {
//  e.preventDefault()
//  $(this).tab('show')
//})




/**
 * Create the module. Set it up to use html5 mode.
  */
window.MyQuotes = angular.module('myQuotes', ['elasticsearch'],
  ['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
		enabled: true,
		//requireBase: false
	});
  }]
);


/**
 * Create a controller to interact with the UI.
 */
MyQuotes.controller('quoteCtrl', ['quoteService', '$scope', '$location','$http', function(quotes, $scope, $location, $http) {
  // Provide some nice initial choices
  var initChoices = [
      "funny",
      "love",
      "dog",
      "cat",
      "woman"
  ];
  var idx = Math.floor(Math.random() * initChoices.length);
 
  // Initialize the scope defaults.
  $scope.quotes = [];        // An array of quote results to display
  $scope.page = 0;            // A counter to keep track of our current page
  $scope.allResults = false;  // Whether or not all results have been found.
  
 
  // And, a random search term to start if none was present on page load.
  $scope.searchTerm = $location.search().q || initChoices[idx];
 
  /**
   * A fresh search. Reset the scope variables to their defaults, set
   * the q query parameter, and load more results.
   */
  $scope.search = function() {
    $scope.page = 0;
    $scope.quotes = [];
    $scope.quote = null;
    $scope.allResults = false;
    $location.search({'q': $scope.searchTerm});
    $scope.loadMore();
  };
 
  /**
   * Load the next page of results, incrementing the page counter.
   * When query is finished, push results onto $scope.quotes and decide
   * whether all results have been returned (i.e. were 10 results returned?)
   */
  $scope.loadMore = function() {
    quotes.search($scope.searchTerm, $scope.page++).then(function(results) {
      if (results.length !== 10) {
        $scope.allResults = true;
      }
 
      var ii = 0;
 
      for (; ii < results.length; ii++) {
        $scope.quotes.push(results[ii]);
      }
    });
  };
 
  // Load results on first run
  $scope.loadMore();
    

  // $http.get("http://localhost:9200/quotes/quote/2").success(function (response) {$scope.quote = response.records;});
  
  $scope.getQofDay = function () {
    var currentTime = new Date();
    var day = currentTime.getDate();
    var src = "http://localhost:9200/quotes/quote/"+day;
    $http.get(src).success(function (response) {
      $scope.response = response._source.text;
      $scope.auth = response._source.auth;
    });

  };  

  // Load quote of the day by default
  $scope.getQofDay();

  $scope.getRandomQuote = function () {
    var min = 1, max = 26;
    var id = Math.floor(Math.random() * (max - min + 1)) + min;
    /**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
    var src = "http://localhost:9200/quotes/quote/"+id;
    $http.get(src).success(function (response) {
      $scope.response = response._source.text;
      $scope.auth = response._source.auth;
    });

  };  
    
}]);




MyQuotes.factory('quoteService', ['$q', 'esFactory', '$location', function($q, elasticsearch, $location) {
  var client = elasticsearch({
    host: $location.host() + ':9200'
  });
 
  /**
   * Given a term and an offset, load another round of 10 quotes.
   *
   * Returns a promise.
   */
  var search = function(term, offset) {
    var deferred = $q.defer();
    var query = {
      match: {
        _all: term
      }
    };
 
    client.search({
      index: 'quotes',
      type: 'quote',
      body: {
        size: 10,
        from: (offset || 0) * 10,
        query: query
      }
    }).then(function(result) {
      var ii = 0, hits_in, hits_out = [];
 
      hits_in = (result.hits || {}).hits || [];
 
      for(; ii < hits_in.length; ii++) {
        hits_out.push(hits_in[ii]._source);
      }
 
      deferred.resolve(hits_out);
    }, deferred.reject);
 
    return deferred.promise;
  };
 
  // Since this is a factory method, we return an object representing the actual service.
  return {
    search: search
  };
}]);


$('#qday').click(function() {
    $('h3.panel-title').html('Quote of the day');
    $('div.panel').removeClass('panel-primary');
    $('div.panel').addClass('panel-info');
    
});

$('#qrand').click(function() {
    $('h3.panel-title').html('Random Quote');
    $('div.panel').removeClass('panel-info');
    $('div.panel').addClass('panel-primary');

});