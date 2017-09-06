import angular from 'angular';
import GitHub from 'github-api';
import '../styles/main.scss';

import app from './init_route'

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

