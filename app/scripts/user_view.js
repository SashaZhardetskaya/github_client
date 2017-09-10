import angular from 'angular';
import GitHub from 'github-api';

import '../styles/main.scss';


import app from './init_route'

app.controller('StoreController', ['GitHubService', '$scope', '$filter', function(GitHubService, $scope, $filter) {
  $scope.loadMoreCount = 6;

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

    if($scope.filterByDate) {

      function formatDate(date) {

        let mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;

        let yy = date.getFullYear();
        if (yy < 10) yy = '0' + yy;

        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;

        return yy + '-' + mm + '-' + dd;
      }

      let DateGiven = formatDate($scope.filterByDate);


      console.log(DateGiven);
      // console.log(finalDateGivenGreater);

      finalData = $filter('filter')(finalData, { updated_at: DateGiven }); //30feb and error
      // finalData = $filter('filter')(finalData, { updated_at: 'updated_at' >= DateGiven });

      // finalData.filter(function (obj) {
      //   return obj.updated_at >= DateGiven;
      // });

      // finalData.forEach(function (obj) {
      //   return obj.updated_at >= DateGiven;
      // });

      console.log(finalData);

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
  $scope.filterByDate = '';
  // $scope.repos = [];
  // $scope.visibleRepos = [];
  $scope.userName = GitHubService.getUserName();

  GitHubService.getRepos()
    .then(function(data){
      $scope.repos = data;
      console.log($scope.repos);
    });

}]);