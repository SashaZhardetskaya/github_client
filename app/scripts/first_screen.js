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

  const OAUTH_TOKEN = '4aa57a66c75800d28444983ecfe7b33caa364e06';
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

    $scope.filterRepos = function () {
        let reposArr = $scope.repos;
        function filterIsFork(obj) {
            return obj.fork;
        };
        function filterIsSourse(obj) {
            return !obj.fork;
        };
        function filterLang(obj) {
            let repoLang = $scope.repoLang.toLowerCase();
            console.log(repoLang);
            if ((obj.language && obj.language.toLowerCase()) == repoLang){
              return obj.language;
          }
        };
        function filterStarred(obj) {
            let starsSelect = $scope.repoStars;
            console.log(starsSelect);
            if (obj.stargazers_count >= starsSelect){
                return obj.stargazers_count;
            }
        };
        function filterOpenIssuses(obj) {
            if (obj.open_issues > 0){
                return obj.open_issues;
            }
        };
        let filteredRepos = reposArr.filter(filterIsSourse);
        // let filteredRepos = reposArr.filter(filterIsSourse).filter(filterLang);
        console.log(filteredRepos);
    };

    $scope.sortRepoNameAscending = function () {
        let reposArr = $scope.repos;
        let sortedRepo = reposArr.sort(function(a, b){
            let nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
            if (nameA < nameB) {
                return -1;
            } else {
                return 1;
            };
            return 0;
        });
        console.log(sortedRepo);
    };
    $scope.sortRepoNameDescending = function () {
        let reposArr = $scope.repos;
        let sortedRepo = reposArr.sort(function(a, b){
            let nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
            if (nameA > nameB) {
                return -1;
            } else {
                return 1;
            };
            return 0;
        });
        console.log(sortedRepo);
    };




    $scope.sortRepoStarsAscending = function () {
        let reposArr = $scope.repos;
        let sortedRepo = reposArr.sort(function(a, b){
            let valueA=a.stargazers_count, valueB=b.stargazers_count;
            if (valueA < valueB) {
                return -1;
            } else {
                return 1;
            };
            return 0;
        });
        console.log(sortedRepo);
    };
    $scope.sortRepoStarsDescending = function () {
        let reposArr = $scope.repos;
        let sortedRepo = reposArr.sort(function(a, b){
            let valueA=a.stargazers_count, valueB=b.stargazers_count;
            if (valueA > valueB) {
                return -1;
            } else {
                return 1;
            };
            return 0;
        });
        console.log(sortedRepo);
    };

}]);





