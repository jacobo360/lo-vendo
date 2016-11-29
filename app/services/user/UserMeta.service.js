;
(function () {
    "use strict";

    angular.module('LoVendoApp.services')
        .factory('UserMeta', ['$http', '$q', '$rootScope', 'Authentication', UserMeta]);

    function UserMeta($http, $q, $rootScope, Authentication) {
        /**
         * Get all saved houses associated with
         * logged in user from the database
         * 
         */

        function getSavedHouses() {
            var deferred = $q.defer();
            var userId = Authentication.isAuthenticated() ? $rootScope.credentials.user._id : null;
            var token = Authentication.isAuthenticated() ? $rootScope.credentials.token : null;
            var url = "https://warm-lowlands-68974.herokuapp.com" + '/saved/houses';
            $http.get(url, {
                    headers: {
                        "x-access-token": token
                    },
                    params: {
                        "id": userId
                    }
                })
                .then(dataReceived)
                .catch(dataError);


            //Recieved data and resolves promise
            function dataReceived(res) {
                console.log(res);
                return deferred.resolve(res.data[0]);
            }
            //If error, rejects promise
            function dataError(err) {
                return deferred.reject(err);
            }

            return deferred.promise;
        }

        /**
         * Saves house in the database
         * @param {Object} data
         * 
         */

        function postSavedHouse(data) {
            var deferred = $q.defer();
            data.userId = Authentication.isAuthenticated() ? $rootScope.credentials.user._id : null;
            var token = Authentication.isAuthenticated() ? $rootScope.credentials.token : null;
            var url = "https://warm-lowlands-68974.herokuapp.com" + '/saved/houses';
            $http({
                    method: 'POST',
                    url: url,
                    headers: {
                        "x-access-token": token
                    },
                    data: data
                })
                .then(houseSaved)
                .catch(houseError);

            function houseSaved(response) {
                console.log(response);
                deferred.resolve(response)
            }

            function houseError(err) {
                console.log('Error = ', err);
                deferred.reject(err);
            }

            return deferred.promise;
        }

        /**
         * Deletes a saved house from the database
         * @param {Object} id
         * 
         */

        function deleteSavedHouse(id) {
            var deferred = $q.defer();
            var userId = Authentication.isAuthenticated() ? $rootScope.credentials.user._id : null;
            var token = Authentication.isAuthenticated() ? $rootScope.credentials.token : null;
            var url = "https://warm-lowlands-68974.herokuapp.com" + '/saved/houses/' + id;
            $http({
                    method: 'PUT',
                    url: url,
                    params: {
                        userId: userId
                    },
                    headers: {
                        "x-access-token": token
                    }
                })
                .then(houseDeleted)
                .catch(houseError);

            function houseDeleted(response) {
                console.log(response);
                deferred.resolve(response)
            }

            function houseError(err) {
                console.log('Error = ', err);
                deferred.reject(err);
            }

            return deferred.promise;
        }

        /**
         * Get all saved searches associated with
         * logged in user from the database
         * 
         */

        function getSavedSearches() {
            var deferred = $q.defer();
            var userId = Authentication.isAuthenticated() ? $rootScope.credentials.user._id : null;
            var token = Authentication.isAuthenticated() ? $rootScope.credentials.token : null;
            var url = "https://warm-lowlands-68974.herokuapp.com" + '/saved/searches';
            $http.get(url, {
                    headers: {
                        "x-access-token": token
                    },
                    params: {
                        "id": userId,
                    }
                })
                .then(dataReceived)
                .catch(dataError);
            //Recieved data and resolves promise
            function dataReceived(res) {
                console.log(res);
                return deferred.resolve(res.data[0]);
            }
            //If error, rejects promise
            function dataError(err) {
                return deferred.reject(err);
            }

            return deferred.promise;
        }

        /**
         * Saves search in the database
         * @param {Object} data
         * 
         */

        function postSavedSearch(data) {
            var deferred = $q.defer();
            data.userId = Authentication.isAuthenticated() ? $rootScope.credentials.user._id : null;
            var token = Authentication.isAuthenticated() ? $rootScope.credentials.token : null;
            var url = "https://warm-lowlands-68974.herokuapp.com" + '/saved/searches';
            console.log(data);
            $http({
                    method: 'POST',
                    url: url,
                    headers: {
                        "x-access-token": token
                    },
                    data: data
                })
                .then(searchSaved)
                .catch(searchError);

            function searchSaved(response) {
                console.log(response);
                deferred.resolve(response)
            }

            function searchError(err) {
                console.log('Error = ', err);
                deferred.reject(err);
            }

            return deferred.promise;
        }

        /**
         * Deletes a saved search from the database
         * @param {String} id
         * 
         */

        function deleteSavedSearch(id) {
            var deferred = $q.defer();
            var userId = Authentication.isAuthenticated() ? $rootScope.credentials.user._id : null;
            var token = Authentication.isAuthenticated() ? $rootScope.credentials.token : null;
            var url = "https://warm-lowlands-68974.herokuapp.com" + '/saved/searches/' + id;
            $http({
                    method: 'PUT',
                    url: url,
                    params: {
                        userId: userId
                    },
                    headers: {
                        "x-access-token": token
                    }
                })
                .then(searchDeleted)
                .catch(searchError);

            function searchDeleted(response) {
                console.log(response);
                deferred.resolve(response)
            }

            function searchError(err) {
                console.log('Error = ', err);
                deferred.reject(err);
            }

            return deferred.promise;
        }

        /**
         * Returns all available tags
         * 
         */

        function avTags() {
            return [{
                id: 0,
                name: "Baños Min",
                filter: "minbaths"
            }, {
                id: 1,
                name: "Baños Max",
                filter: "maxbaths"
            }, {
                id: 2,
                name: "Camas Min",
                filter: "minbeds"
            }, {
                id: 3,
                name: "Camas Max",
                filter: "maxbeds"
            }, {
                id: 4,
                name: "Precio Min",
                filter: "minprice"
            }, {
                id: 5,
                name: "Precio Max",
                filter: "maxprice"
            }, {
                id: 6,
                name: "Area Min",
                filter: "minarea"
            }, {
                id: 7,
                name: "Area Max",
                filter: "maxarea"
            }, {
                id: 8,
                name: "Tipo",
                filter: "type"
            }, {
                id: 9,
                name: "Q",
                filter: "q"
            }];
        }

        return {
            getSavedHouses: getSavedHouses,
            postSavedHouse: postSavedHouse,
            deleteSavedHouse: deleteSavedHouse,
            getSavedSearches: getSavedSearches,
            postSavedSearch: postSavedSearch,
            deleteSavedSearch: deleteSavedSearch,
            avTags: avTags
        }
    }

})();