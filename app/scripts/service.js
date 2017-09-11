import angular from 'angular';
import GitHub from 'github-api';
import '../styles/main.scss';

import app from './init_route';



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