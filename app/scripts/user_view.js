import angular from 'angular';
import ngInfiniteScroll from 'ng-infinite-scroll';
import GitHub from 'github-api';

import '../styles/main.scss';


import app from './init_route'

app.controller('StoreController', ['GitHubService', '$scope', '$filter', function(GitHubService, $scope, $filter) {
  $scope.loadMoreCount = 12;

  $scope.loadMore = function () {
    let increamented = $scope.loadMoreCount + 12;
    $scope.loadMoreCount = increamented > $scope.repos.length ? $scope.repos.length : increamented;
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