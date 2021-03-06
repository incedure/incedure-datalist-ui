define([
  'angular',
  'text!./cam-tasklist-form-generic.html'
], function(
  angular,
  template
) {
  'use strict';

  function noop () {}

  return [
    'CamForm',
    'camAPI',
  function(
    CamForm,
    camAPI
  ){

    return {

      restrict: 'A',

      require: '^camTasklistForm',

      scope: true,

      template: template,

      link: function($scope, $element, attrs, formController) {

        var formElement = $element.find('form');
        var camForm = null;
        var form = {
          '$valid': false,
          '$invalid': true
        };

        var $update = false;

        $scope.$watch(function () {
          return $update;
        }, function (value) {
          if (value) {
            showForm(value, formController.getParams());
            $update = false;
          }
        });

        $scope.$watch(function () {
          return formController.getTasklistForm();
        }, function (value) {
          if (value) {
            $update = true;
            $scope.variables = [];
          }
        });

        $scope.$watch(function() {
          return form && form.$valid;
        }, function(value) {
          formController.notifyFormValidated(!value);
        });

        function showForm(tasklistForm, params) {
          params = angular.copy(params);

          delete params.processDefinitionKey;

          angular.extend(params, {
            client: camAPI,
            formElement: formElement,
            done: done
          });

          camForm = new CamForm(params);
        }

        var done = function (err, _camForm) {
          if (err) {
            return formController.notifyFormInitializationFailed(err);
          }
          camForm = _camForm;

          var formName = _camForm.formElement.attr('name');
          var camFormScope = _camForm.formElement.scope();

          if (!camFormScope) {
            return;
          }

          form = camFormScope[formName];
          formController.notifyFormInitialized();
        };

        function clearVariableManager() {
          var variables = camForm.variableManager.variables;
          for (var v in variables) {
            camForm.variableManager.destroyVariable(v);
          }
        }

        function clearFields() {
          camForm.fields = [];
        }

        var complete = function (callback) {

          function localCallback(error, result) {
            clearVariableManager();
            clearFields();
            return callback(error, result);
          }

          try {
            camForm.initializeFieldHandlers();
          } catch (error) {
            return localCallback(error);
          }

          var variables = camForm.variableManager.variables;
          for (var v in variables) {
            variables[v].value = null;
          }
          camForm.submit(localCallback);
        };

        formController.registerCompletionHandler(complete);

      }
    };
  }];
});
