define([
        'text!./cam-tasklist-task-detail-uploader-plugin.html'
        ],
    function(template) {

    'use strict';
    var Controller = ['$scope', function ($scope){

        // setup ///////////////////////////////////////////////////////////
        var uploaderData = $scope.taskData.newChild($scope);

        // provider ////////////////////////////////////////////////////////
        uploaderData.provide('taskUploading', [ 'task', function (task) {
            var obj = {};
            obj.task = task;
            return obj;
        }]);

    }];

    var Configuration = function PluginConfiguration(ViewsProvider) {
        ViewsProvider.registerDefaultView('tasklist.task.detail', {
            id: 'task-detail-uploader',
            label: 'UPLOAD',
            template: template,
            controller: Controller,
            priority: 900
        });
    };
    Configuration.$inject = ['ViewsProvider'];
    return Configuration;
});