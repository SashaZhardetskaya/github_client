import angular from 'angular';
import GitHub from 'github-api';

import '../styles/first_screen.scss';


var app = angular.module('githubClient', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl : 'user-pg.html',
      controller: 'LoginController'
    })
    .when('/repositories', {
      templateUrl: 'repos-pg.html',
      controller: 'StoreController'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

app.service('GitHubService', ['$window', '$q', function($window, $q){
  // initializing

  const OAUTH_TOKEN = 'a35a7a9180af8e1aa31517747e36f0db51ac2741';
  const gh = new GitHub({
    token: OAUTH_TOKEN,
    headers: {
      'Accept': 'application/vnd.github.mercy-preview+json'
    }
  });

  let userName = $window.localStorage.getItem('GitHubUserName') || 'sashazhardetskaya';

  const service = {
    userName: userName,
    setUser: function(name) {
      $window.localStorage.setItem('GitHubUserName', name);
      this.userName = name;
    },
    getUserName: function(){
      return this.userName;
    },
    getRepos: function(){
      let deferred = $q.defer();

      gh.getUser(this.userName).listRepos()
        .then(function({ data: reposJson }){
          deferred.resolve(reposJson);
        })
        .catch(function(error){
          console.log('Error!', error);
          deferred.reject(error);
        });

      return deferred.promise;
    }
  };

  return service;
}]);

app.controller('LoginController', ['$scope', 'GitHubService', '$location', function($scope, GitHubService, $location) {
  $scope.gitHubName = '';

  $scope.setName = function () {
    GitHubService.setUser($scope.gitHubName);
    $location.path('/repositories');
  };
}]);

app.controller('StoreController', ['GitHubService', '$scope', function(GitHubService, $scope) {
  let loadMoreCount = 10;

  $scope.loadMore = function () {
    // $scope.visibleRepos = $scope.repos.slice()
  };



  // $scope.repos = [];
  // $scope.visibleRepos = [];
  $scope.userName = GitHubService.getUserName();

  GitHubService.getRepos()
    .then(function(data){
      $scope.repos = data;
      console.log($scope.repos);
    });

}]);





