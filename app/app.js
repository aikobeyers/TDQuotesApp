'use strict'

angular.module('App', ['ngRoute','LocalStorageModule', 'ngCookies'])

.config(function($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'assets/views/home.html',
                controller: 'homeCtrl'
            })
            .when('/td', {
                templateUrl: 'assets/views/persons.html',
                controller: 'personsCtrl'
            })
            .when('/quotes/:person_id', {
                templateUrl: 'assets/views/quotes.html',
                controller: 'quotesCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
    })
    .controller('homeCtrl', ['$scope', function homeCtrl($scope) {}])
    .controller('personsCtrl', ['$scope', 'personSrv', function personsCtrl($scope, personSrv) {
        personSrv.getAllPersons().then(function(info){ $scope.persons = info})
    }])
    .controller('quotesCtrl', ['$scope', '$routeParams', 'personSrv', 'quotesSrv', 'localStorageService', function quotesCtrl($scope, $routeParams, personSrv, quotesSrv, localStorageService) {

        personSrv.getPerson($routeParams.person_id).then(function(info) { $scope.person = info})
        quotesSrv.getAllQuotesFromPerson($routeParams.person_id).then(function(info){ $scope.quotes = info});


    }])






    .factory('personSrv', ['$http', '$q',function($http, $q) {
      var persons=[];
      var person;
      var quotes=[];
        return {
            getAllPersons: function() {

            var q = $q.defer();
            $http.get('https://aikobeyers.cloudant.com/quotes/_all_docs?include_docs=true').
              success(function(data, status, headers, config) {
                q.resolve(data.rows);
              });
              return q.promise;
          }
            ,
            getPerson: function(person_id) {
              var q = $q.defer();
              $http.get('https://aikobeyers.cloudant.com/quotes/' + person_id).
                success(function(data, status, headers, config) {
                  q.resolve(data.name);
                });
                return q.promise;

            }
        }
    }])
    .factory('quotesSrv',  ['$http', '$q', function($http, $q) {
      return {
            getAllQuotesFromPerson: function(person_id) {
              var q = $q.defer();
              $http.get('https://aikobeyers.cloudant.com/quotes/' + person_id).
                success(function(data, status, headers, config) {
                  q.resolve(data.quotes);
                });
                return q.promise;

            }
        }
    }]);
