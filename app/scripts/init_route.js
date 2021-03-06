import angular from 'angular';
import GitHub from 'github-api';
import '../styles/main.scss';


let app = angular.module('githubClient', ['ngRoute']);

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



export default app;





