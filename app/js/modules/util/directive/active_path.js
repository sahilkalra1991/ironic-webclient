/*
 * Copyright (c) 2015 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * This directive requires ui-router, as it listens for events dispatched as
 * a user navigates through the application, and adds the 'active' class to
 * the bound element if the user's selected path matches the one configured.
 */
angular.module('ironic.util').directive('activePath',
  function ($location, $rootScope) {
    'use strict';

    return {
      'link': function ($scope, element, attrs) {
        var activePath = attrs.activePath;

        function setActivePath () {
          var path = $location.path();
          var isMatchedPath = path.match(activePath) !== null;

          element.toggleClass('active', isMatchedPath);
        }

        // This is angularjs magic, the return method from any $on
        // binding will return a function that will disconnect
        // that binding.
        var disconnectBinding =
          $rootScope.$on('$stateChangeSuccess', setActivePath);
        $scope.$on('$destroy', disconnectBinding);

        // INIT
        setActivePath();
      }
    };
  });
