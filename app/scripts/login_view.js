import angular from 'angular';
import GitHub from 'github-api';
import '../styles/main.scss';

import app from './init_route';

app.controller('LoginController', ['$scope', 'GitHubService', '$location', function($scope, GitHubService, $location) {
  $scope.gitHubName = '';

  $scope.setName = function () {
    GitHubService.setUser($scope.gitHubName);
    $location.path('/repositories');
  };
}]);