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
    .when('/repositories/:repoName', {
      templateUrl: 'repo-pg.html',
      controller: 'RepoController'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

app.service('GitHubService', ['$window', '$q', '$http', function($window, $q, $http){
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
    },
    getRepo: function(name){
      let deferred = $q.defer();

      var obj = {
        repoName: name
      };

      gh.getRepo(this.userName, name).getDetails()
        .then(function({ data: repo }){
          obj.htmlUrl = repo.html_url;
          obj.fork = repo.fork;
          obj.pulls_url = repo.pulls_url;
          obj.contributors_url = repo.contributors_url;

          return $http.get(repo.languages_url)
        })
        .then(function({ data: languages }) {
          let langs = [];
          for (let [k, v] of Object.entries(languages)) {
            langs.push({ language: k, size: v / 1000 })
          }

          obj.languages = langs.filter( lang => lang.size > 1 );

          return $http.get(obj.pulls_url.replace('{/number}', '?state=open&sort=popularity&direction=desc&per_page=5'))
        })
        .then(function({ data: pulls }) {
          obj.pulls = pulls;

          return $http.get(obj.contributors_url);
        })
        .then(function({ data: contributors }) {
          obj.contributors = contributors.slice(0, 3);

          deferred.resolve(obj);
        })
        .catch(function(error){
          console.log('Error!', error);
          deffered.reject(error);
        });

      return deferred.promise;
    }
  };

  return service;
}]);

app.controller('RepoController', ['$scope', '$routeParams', 'GitHubService', '$location', function($scope, $routeParams, GitHubService, $location) {
    $scope.repo = {};
    $scope.isLoading = true;

    GitHubService.getRepo($routeParams.repoName)
      .then(function(data) {
        $scope.repo = data;
        $scope.isLoading = false;
        console.log(data);
      })
      .catch(function(error){
        $location.path('/repositories');
      });
}]);

app.controller('LoginController', ['$scope', 'GitHubService', '$location', function($scope, GitHubService, $location) {
  $scope.gitHubName = '';

  $scope.setName = function () {
    GitHubService.setUser($scope.gitHubName);
    $location.path('/repositories');
  };
}]);

app.controller('StoreController', ['GitHubService', '$scope', '$filter', function(GitHubService, $scope, $filter) {
  let loadMoreCount = 10;

  $scope.loadMore = function () {
    // $scope.visibleRepos = $scope.repos.slice()
  };

  $scope.getData = function() {
    let finalData = $scope.repos;


    if($scope.filterByLang.length) {
      finalData = $filter('filter')(finalData, { language: $scope.filterByLang });
    }

    if($scope.filterByOpenIssues) {

      finalData = $filter('filter')(finalData, { open_issues_count: $scope.filterByOpenIssues });
      console.log(finalData);
    }

    if($scope.filterByStars) {
      finalData = $filter('filter')(finalData, { stargazers_count: $scope.filterByStars });
    }

    if($scope.filterBySource) {
      finalData = $filter('filter')(finalData, { fork: $scope.filterBySource });
    }

//////
    if($scope.sortByRepoName) {
      finalData = $filter('orderBy')(finalData, $scope.sortByRepoNameValue === 'descending' ? '-name' : 'name');
    }

    if($scope.sortByOpenIssues) {
      finalData = $filter('orderBy')(finalData, $scope.sortByRepoOpenIssuesValue === 'descending' ? '-open_issues_count' : 'open_issues_count');
    }

    if($scope.sortByStars) {
      finalData = $filter('orderBy')(finalData, $scope.sortByRepoStarsValue === 'descending' ? '-stargazers_count' : 'stargazers_count');
    }

    if($scope.sortByUpdate) {
      finalData = $filter('orderBy')(finalData, $scope.sortByRepoUpdateValue === 'descending' ? '-updated_at' : 'updated_at');
    }


    return finalData;
  };

  $scope.sortByRepoName = false;
  $scope.sortByRepoNameValue = 'descending';
  $scope.sortByRepoOpenIssuesValue = 'descending';
  $scope.sortByRepoStarsValue = 'descending';
  $scope.sortByRepoUpdateValue = 'descending';
  $scope.filterByLang = '';
  $scope.filterByOpenIssues = '';
  $scope.filterByStars = '';
  $scope.filterBySource = false;
  // $scope.repos = [];
  // $scope.visibleRepos = [];
  $scope.userName = GitHubService.getUserName();

  GitHubService.getRepos()
    .then(function(data){
      $scope.repos = data;
      console.log($scope.repos);
    });






}]);





