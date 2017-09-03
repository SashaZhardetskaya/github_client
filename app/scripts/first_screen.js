import angular from 'angular';
import GitHub from 'github-api';

import '../styles/first_screen.scss';


var app = angular.module('githubClient', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when("/", {
            templateUrl : 'user-pg.html',
            controller: 'loginController'
        })
        .when('/repos', {
            templateUser: 'repos-pg.html',
            controller: 'storeController'
        })
        .otherwise({
            templateUser: 'user-pg.html',
            controller: 'loginController'
        });
}]);

app.service('GithubService', function(){
    // initializing

    const OAUTH_TOKEN = '3f22856466dcf4cd6240cbf87cd4985d9ef67f8d';
    const gh = new GitHub({
        token: OAUTH_TOKEN
    });


    const service = {
        user: '',
        repos: [],
        setUser: function(name) {
            this.user = gh.getUser(name);
        },
        getRepos: function(){
            this.user.listRepos()
                .then(function(response){
                    console.log(response);
                    this.repos = response.data;

                    return this.repos;
                })
                .catch(function(error){
                    console.error('Error!', error);

                    return [];
                });
        }
    };

    return service;
});

app.controller('loginController', ['GithubService', '$location', function loginController(GithubService, $location) {
    // console.log(loginController.setName());

    this.setName = function () {
        GithubService.setUser(this.githubName);
        $location.url('/repos');
    }
        // console.log(gh);

        // gh.getUser(this.githubName).then(function(response){
        //     console.log(response);
        // });
        // console.log(this.githubUser);
        // this.githubUser.listRepos()
        //     .then(({data: reposJson}) => {
        //         console.log(reposJson);
        //         const reposArr = reposJson;
        //         console.log(`SashaZhardetskaya has ${reposJson.length} repos!`);
        //
        //
        //
        //         app.controller('storeController', function () {
        //             console.log(reposArr);
        //         })
        //
        //
        //
        //     });
}]);

app.controller('storeController', ['GitHubService', function storeController(GitHubService) {
    console.log(GitHubService.getUser());
}]);



// const githubUser = gh.getUser('SashaZhardetskaya');
//
// githubUser.listRepos()
//     .then(({data: reposJson}) => {
//         console.log(reposJson);
//         const reposArr = reposJson;
//         console.log(`SashaZhardetskaya has ${reposJson.length} repos!`);
//     });



// clayreimann.listRepos()
//     .then(function({data: reposJson}) {
//         console.log(reposJson);
//         console.log(`SashaZhardetskaya has ${reposJson.length} repos!`);
//     });






