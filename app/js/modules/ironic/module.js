/*
 * Copyright (c) 2015 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * The Ironic Root Application.
 *
 * This module defines dependencies and root routes, but no actual
 * functionality.
 */
angular.module('ironic', ['ui.router', 'ui.bootstrap',
  'ironic.drivers', 'ironic.nodes', 'ironic.ports',
  'ironic.util', 'ironic.api'])
  .config(function ($urlRouterProvider, $httpProvider, $stateProvider) {
    'use strict';

    // Default UI route
    $urlRouterProvider.otherwise('/ironic');

    // Ironic's root state, used to resolve global resources before
    // the application fully initializes.
    $stateProvider
      .state('ironic', {
        'url': '/ironic',
        'views': {
          '@': {
            'controller': 'ApplicationController as appCtrl',
            'templateUrl': 'view/ironic/index.html'
          }
        },
        'resolve': {
          'selectedConfiguration': function($$configuration, $q) {
            var deferred = $q.defer();
            $$configuration.resolveSelected().then(
              function(selectedConfig) {
                if (!selectedConfig) {
                  deferred.reject('no_config');
                } else {
                  $deferred.resolve(selectedConfig);
                }
              });
            return deferred.promise;
          },
          'configuration': function ($$configuration) {
            return $$configuration.resolveAll();
          }
        }
      })
      .state('config', {
        'url': '/config',
        'templateUrl': 'view/ironic/config.html',
        'controller': 'ConfigurationController as ctrl',
        'resolve': {
          'localConfig': function ($$configuration) {
            return $$configuration.resolveLocal();
          },
          'autoConfig': function ($$configuration) {
            return $$configuration.resolveAutodetection();
          },
          'fileConfig': function ($$configuration) {
            return $$configuration.resolveConfigured();
          }
        }
      });
  })
  .run(function ($rootScope, $state) {
    'use strict';

    var listener = $rootScope.$on('$stateChangeError',
      function (evt, toState, toParams, fromState, fromParams, reason) {
        if (reason === 'no_config') {
          $state.go('config');
        } else {
          $state.go('ironic');
        }
      });
    $rootScope.$on('$destroy', listener);
  });
